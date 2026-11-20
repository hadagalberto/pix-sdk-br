/**
 * Runtime validation engine shared by every generated validator in
 * `src/generated/validators.ts`.
 *
 * The engine evaluates a small constraint IR ("kind"-tagged objects) that the
 * generator compiles from the OpenAPI schemas. Keeping the interpreter in one
 * hand-written module means every constraint behaviour lives in one well-tested
 * place, while `src/generated/` stays declarative and reviewable.
 *
 * Design notes:
 * - Values are treated as read-only: validation never mutates or clones input.
 * - All failures are collected (the engine does not stop at the first issue).
 * - Issue paths use dot/bracket notation from the validated root (e.g.
 *   `valor.retirada.saque.valor`, `pix[0].devolucoes[1].horario.solicitacao`).
 */

/** A single validation failure, located inside the validated value. */
export interface ValidationIssue {
  /** Path from the validated root. Empty string when the root itself failed. */
  readonly path: string;
  /** Human-readable, stable description of the failure (English). */
  readonly message: string;
}

export interface ValidationSuccess<T> {
  readonly ok: true;
  readonly value: T;
}

export interface ValidationFailure {
  readonly ok: false;
  readonly issues: readonly ValidationIssue[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export interface StringConstraint {
  readonly kind: "string";
  readonly minLength?: number;
  readonly maxLength?: number;
  /** Already normalized: the generator strips erroneous `/^…$/` wrappers. */
  readonly pattern?: RegExp;
  readonly format?: StringFormat;
  readonly enumValues?: readonly string[];
}

export interface NumberConstraint {
  readonly kind: "number";
  readonly integer?: boolean;
  readonly minimum?: number;
  readonly maximum?: number;
}

export interface BooleanConstraint {
  readonly kind: "boolean";
}

export interface ArrayConstraint {
  readonly kind: "array";
  readonly items: Constraint;
  readonly minItems?: number;
  readonly maxItems?: number;
  readonly uniqueItems?: boolean;
}

export interface ObjectConstraint {
  readonly kind: "object";
  /** Declared properties. `required` may additionally list presence-only keys. */
  readonly properties: Readonly<Record<string, Constraint>>;
  /** Keys that must be present (superset of nothing in particular — may include
   *  keys not declared in `properties`, in which case only presence is enforced). */
  readonly required: readonly string[];
  /** When false, keys outside `properties` are rejected. OpenAPI defaults to true. */
  readonly additionalProperties: boolean;
}

export interface AllOfConstraint {
  readonly kind: "allOf";
  readonly members: readonly Constraint[];
}

export interface OneOfConstraint {
  readonly kind: "oneOf";
  readonly members: readonly Constraint[];
}

export interface AnyOfConstraint {
  readonly kind: "anyOf";
  readonly members: readonly Constraint[];
}

/** Reference to a named constraint in the registry (resolved lazily). */
export interface RefConstraint {
  readonly kind: "ref";
  readonly name: string;
}

export interface NullableConstraint {
  readonly kind: "nullable";
  readonly inner: Constraint;
}

export type Constraint =
  | StringConstraint
  | NumberConstraint
  | BooleanConstraint
  | ArrayConstraint
  | ObjectConstraint
  | AllOfConstraint
  | OneOfConstraint
  | AnyOfConstraint
  | RefConstraint
  | NullableConstraint;

/** String formats enforced by the engine. */
export type StringFormat = "date" | "date-time" | "uri";

/** Maps constraint names (see `RefConstraint`) to their constraint IR. */
export type ConstraintRegistry = ReadonlyMap<string, Constraint>;

const MAX_DEPTH = 64;

/**
 * BCB schemas write regexes such as `[a-zA-Z0-9]{26,35}` and `\d{1,10}\.\d{2}`
 * as *whole-value* constraints even though JSON Schema's `pattern` is formally
 * an unanchored search. Matching with a bare `.test()` therefore accepted
 * overlong txids and malformed money values containing a valid substring.
 * Anchoring here (centrally, for every generated pattern) enforces the BCB
 * intent and cannot be undone by regenerating `src/generated/`.
 */
const anchoredPatterns = new WeakMap<RegExp, RegExp>();

function matchesFullPattern(pattern: RegExp, value: string): boolean {
  let anchored = anchoredPatterns.get(pattern);
  if (anchored === undefined) {
    anchored = new RegExp(`^(?:${pattern.source})$`, pattern.flags);
    anchoredPatterns.set(pattern, anchored);
  }
  return anchored.test(value);
}

export function validate<T>(
  root: Constraint,
  value: unknown,
  registry: ConstraintRegistry,
): ValidationResult<T> {
  const issues: ValidationIssue[] = [];
  check(root, value, "", issues, registry, 0);
  return issues.length === 0 ? { ok: true, value: value as T } : { ok: false, issues };
}

/** Type guard helper for call sites that only care about success. */
export function isValid(
  constraint: Constraint,
  value: unknown,
  registry: ConstraintRegistry,
): boolean {
  return validate(constraint, value, registry).ok;
}

function check(
  constraint: Constraint,
  value: unknown,
  path: string,
  issues: ValidationIssue[],
  registry: ConstraintRegistry,
  depth: number,
): void {
  if (depth > MAX_DEPTH) {
    issues.push(issue(path, `value nesting exceeds the maximum supported depth (${MAX_DEPTH})`));
    return;
  }
  switch (constraint.kind) {
    case "ref": {
      const resolved = registry.get(constraint.name);
      if (resolved === undefined) {
        throw new Error(`unknown constraint reference "${constraint.name}"`);
      }
      check(resolved, value, path, issues, registry, depth + 1);
      return;
    }
    case "nullable":
      if (value === null) return;
      check(constraint.inner, value, path, issues, registry, depth + 1);
      return;
    case "string":
      checkString(constraint, value, path, issues);
      return;
    case "number":
      checkNumber(constraint, value, path, issues);
      return;
    case "boolean":
      if (typeof value !== "boolean") {
        issues.push(issue(path, `expected boolean, received ${typeName(value)}`));
      }
      return;
    case "array":
      checkArray(constraint, value, path, issues, registry, depth);
      return;
    case "object":
      checkObject(constraint, value, path, issues, registry, depth);
      return;
    case "allOf":
      for (const member of constraint.members) {
        check(member, value, path, issues, registry, depth + 1);
      }
      return;
    case "oneOf": {
      const matches = countMatches(constraint.members, value, registry, depth);
      if (matches !== 1) {
        issues.push(
          issue(
            path,
            `must match exactly one of ${constraint.members.length} alternatives (matched ${matches})`,
          ),
        );
      }
      return;
    }
    case "anyOf": {
      const matches = countMatches(constraint.members, value, registry, depth);
      if (matches === 0) {
        issues.push(
          issue(path, `must match at least one of ${constraint.members.length} alternatives`),
        );
      }
      return;
    }
    default: {
      // Exhaustiveness guard: an unknown kind is a programming error upstream.
      const unknown: never = constraint;
      throw new Error(`unknown constraint kind ${JSON.stringify(unknown)}`);
    }
  }
}

function countMatches(
  members: readonly Constraint[],
  value: unknown,
  registry: ConstraintRegistry,
  depth: number,
): number {
  let matches = 0;
  for (const member of members) {
    const probe: ValidationIssue[] = [];
    check(member, value, "", probe, registry, depth + 1);
    if (probe.length === 0) matches += 1;
  }
  return matches;
}

function checkString(
  constraint: StringConstraint,
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (typeof value !== "string") {
    issues.push(issue(path, `expected string, received ${typeName(value)}`));
    return;
  }
  if (constraint.enumValues !== undefined && !constraint.enumValues.includes(value)) {
    issues.push(
      issue(
        path,
        `value ${JSON.stringify(value)} is not one of ${enumList(constraint.enumValues)}`,
      ),
    );
    return;
  }
  const length =
    constraint.minLength === undefined && constraint.maxLength === undefined
      ? undefined
      : stringLength(value);
  if (constraint.minLength !== undefined && length !== undefined && length < constraint.minLength) {
    issues.push(
      issue(path, `string length ${length} is less than minLength ${constraint.minLength}`),
    );
  }
  if (constraint.maxLength !== undefined && length !== undefined && length > constraint.maxLength) {
    issues.push(issue(path, `string length ${length} exceeds maxLength ${constraint.maxLength}`));
  }
  if (constraint.pattern !== undefined && !matchesFullPattern(constraint.pattern, value)) {
    issues.push(issue(path, `string does not match pattern /${constraint.pattern.source}/`));
  }
  if (constraint.format !== undefined) {
    const formatIssue = checkStringFormat(constraint.format, value);
    if (formatIssue !== undefined) {
      issues.push(issue(path, formatIssue));
    }
  }
}

function checkStringFormat(format: StringFormat, value: string): string | undefined {
  switch (format) {
    case "date":
      return isRfc3339Date(value)
        ? undefined
        : "string is not a valid RFC 3339 date (expected YYYY-MM-DD)";
    case "date-time":
      return isRfc3339DateTime(value)
        ? undefined
        : "string is not a valid RFC 3339 date-time (expected YYYY-MM-DDTHH:MM:SS[.frac](Z|±HH:MM))";
    case "uri":
      return isUri(value) ? undefined : "string is not a valid URI";
  }
}

function checkNumber(
  constraint: NumberConstraint,
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    issues.push(issue(path, `expected number, received ${typeName(value)}`));
    return;
  }
  if (constraint.integer === true && !Number.isInteger(value)) {
    issues.push(issue(path, `expected integer, received ${value}`));
  }
  if (constraint.minimum !== undefined && value < constraint.minimum) {
    issues.push(issue(path, `number ${value} is less than minimum ${constraint.minimum}`));
  }
  if (constraint.maximum !== undefined && value > constraint.maximum) {
    issues.push(issue(path, `number ${value} exceeds maximum ${constraint.maximum}`));
  }
}

function checkArray(
  constraint: ArrayConstraint,
  value: unknown,
  path: string,
  issues: ValidationIssue[],
  registry: ConstraintRegistry,
  depth: number,
): void {
  if (!Array.isArray(value)) {
    issues.push(issue(path, `expected array, received ${typeName(value)}`));
    return;
  }
  if (constraint.minItems !== undefined && value.length < constraint.minItems) {
    issues.push(
      issue(path, `array length ${value.length} is less than minItems ${constraint.minItems}`),
    );
  }
  if (constraint.maxItems !== undefined && value.length > constraint.maxItems) {
    issues.push(
      issue(path, `array length ${value.length} exceeds maxItems ${constraint.maxItems}`),
    );
  }
  if (constraint.uniqueItems === true) {
    const duplicate = findDuplicateIndex(value);
    if (duplicate !== undefined) {
      issues.push(
        issue(
          path,
          `array items at index ${duplicate[0]} and ${duplicate[1]} are equal (uniqueItems is required)`,
        ),
      );
    }
  }
  for (let i = 0; i < value.length; i += 1) {
    check(constraint.items, value[i], `${path}[${i}]`, issues, registry, depth + 1);
  }
}

function checkObject(
  constraint: ObjectConstraint,
  value: unknown,
  path: string,
  issues: ValidationIssue[],
  registry: ConstraintRegistry,
  depth: number,
): void {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    issues.push(issue(path, `expected object, received ${typeName(value)}`));
    return;
  }
  const record = value as Record<string, unknown>;
  for (const key of constraint.required) {
    if (record[key] === undefined) {
      issues.push(issue(path, `missing required property "${key}"`));
    }
  }
  if (!constraint.additionalProperties) {
    for (const key of Object.keys(record)) {
      if (constraint.properties[key] === undefined) {
        issues.push(issue(path, `unexpected property "${key}"`));
      }
    }
  }
  for (const [key, propertyConstraint] of Object.entries(constraint.properties)) {
    if (record[key] !== undefined) {
      check(propertyConstraint, record[key], joinPath(path, key), issues, registry, depth + 1);
    }
  }
}

// ---------------------------------------------------------------------------
// Formats
// ---------------------------------------------------------------------------

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** `YYYY-MM-DD` with real calendar validation (rejects 2024-02-30, 2024-13-01). */
export function isRfc3339Date(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  return isValidCalendarDate(year, month, day);
}

const DATE_TIME_RE =
  /^(\d{4})-(\d{2})-(\d{2})[Tt](\d{2}):(\d{2}):(\d{2})(\.\d+)?([Zz]|[+-]\d{2}:\d{2})$/;

/** RFC 3339 date-time with real calendar and clock validation. */
export function isRfc3339DateTime(value: string): boolean {
  const match = DATE_TIME_RE.exec(value);
  if (match === null) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!isValidCalendarDate(year, month, day)) return false;
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  if (hour > 23 || minute > 59 || second > 60) return false;
  const offset = match[8] ?? "";
  if (offset !== "Z" && offset !== "z" && offset.length === 6) {
    const offsetHour = Number(offset.slice(1, 3));
    const offsetMinute = Number(offset.slice(4, 6));
    if (offsetHour > 23 || offsetMinute > 59) return false;
  }
  return true;
}

/**
 * OpenAPI `format: uri` (RFC 3986). Accepts absolute URIs (validated with the
 * WHATWG URL parser) and relative references without whitespace or control
 * characters — the BCB spec itself uses relative `location` values such as
 * `pix.example.com/qr/v2/9d36b84fc70b478fb95c12729b90ca25` in its examples.
 */
export function isUri(value: string): boolean {
  if (value.length === 0) return false;
  // Fast path for the common absolute-URI case.
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
  // Relative reference: no whitespace, no control characters, no backslashes.
  // (Checked without a regex so control-character matching stays explicit.)
  for (const char of value) {
    const code = char.codePointAt(0);
    if (code === undefined) continue;
    if (code <= 0x20 || code === 0x7f || char === "\\") return false;
  }
  return true;
}

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1) return false;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDay = daysInMonth[month - 1];
  return maxDay !== undefined && day <= maxDay;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function issue(path: string, message: string): ValidationIssue {
  return { path, message };
}

function joinPath(path: string, key: string): string {
  return path === "" ? key : `${path}.${key}`;
}

/** Pair of indexes of the first two equal items, or undefined when all unique. */
function findDuplicateIndex(items: readonly unknown[]): readonly [number, number] | undefined {
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      if (deepEqual(items[i], items[j])) return [i, j];
    }
  }
  return undefined;
}

/** Code-point aware length (minLength/maxLength are character counts). */
function stringLength(value: string): number {
  let ascii = true;
  for (let index = 0; index < value.length; index += 1) {
    if (value.charCodeAt(index) > 0x7f) {
      ascii = false;
      break;
    }
  }
  return ascii ? value.length : Array.from(value).length;
}

function typeName(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const type = typeof value;
  if (type === "number") return Number.isFinite(value) ? "number" : "non-finite number";
  return type;
}

function enumList(values: readonly string[]): string {
  return `[${values.map((v) => JSON.stringify(v)).join(", ")}]`;
}

/** Structural equality used by `uniqueItems`. */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  const recordA = a as Record<string, unknown>;
  const recordB = b as Record<string, unknown>;
  return keysA.every((key) => deepEqual(recordA[key], recordB[key]));
}
