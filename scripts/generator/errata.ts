/**
 * Documented corrections ("errata") applied to the pinned BCB spec before code
 * generation.
 *
 * The upstream `bacen/pix-api` OpenAPI file contains a handful of objectively
 * broken constructs — required keys that no schema declares anywhere, a stray
 * quote inside a YAML flow sequence, numeric keywords applied to arrays, and
 * regexes wrapped in `/.../` delimiters. Left untouched they would produce
 * validators that reject every official example payload the spec itself ships.
 *
 * Every erratum below:
 *   1. targets a construct that is impossible to satisfy (undeclared required
 *      property, unparseable keyword placement) — NOT a stylistic choice;
 *   2. is backed by evidence from the spec's own examples (official payloads
 *      that must validate) or by the same constraint written correctly
 *      elsewhere in the same file;
 *   3. asserts its precondition and fails generation loudly if the upstream
 *      file drifts (so a future spec bump forces a conscious erratum review).
 *
 * The full list is re-emitted into `src/generated/meta.ts` (SPEC_ERRATA) and
 * documented in README.md so users can audit every deviation from upstream.
 */

import type { OpenApiDocument, OpenApiSchema } from "./openapi.js";
import { SCHEMAS_PREFIX, SpecError, refName } from "./openapi.js";

export interface SpecErratumInfo {
  readonly id: string;
  readonly location: string;
  readonly description: string;
}

interface Erratum extends SpecErratumInfo {
  apply(doc: OpenApiDocument): void;
}

/** Narrows `value` or throws a SpecError anchored at `location`. */
function mustExist<T>(value: T | undefined, location: string): T {
  if (value === undefined) {
    throw new SpecError("erratum precondition failed: expected value is missing", location);
  }
  return value;
}

function schema(doc: OpenApiDocument, name: string): OpenApiSchema {
  const schemas = doc.components.schemas;
  const target = schemas?.[name];
  if (target === undefined) {
    throw new SpecError(
      `erratum precondition failed: schema "${name}" not found`,
      "components.schemas",
    );
  }
  return target;
}

function assertRequiredList(
  schema: OpenApiSchema,
  location: string,
  expected: readonly string[],
): void {
  const required = schema.required ?? [];
  const actual = [...required].sort().join(",");
  const wanted = [...expected].sort().join(",");
  if (actual !== wanted) {
    throw new SpecError(
      `erratum precondition failed: expected required [${wanted}], found [${actual}]`,
      location,
    );
  }
}

function removeFromRequired(schema: OpenApiSchema, key: string, location: string): void {
  if (schema.required?.includes(key) !== true) {
    throw new SpecError(`erratum precondition failed: required key "${key}" not found`, location);
  }
  schema.required = schema.required.filter((entry) => entry !== key);
}

function renameInRequired(schema: OpenApiSchema, from: string, to: string, location: string): void {
  if (schema.required?.includes(from) !== true) {
    throw new SpecError(`erratum precondition failed: required key "${from}" not found`, location);
  }
  schema.required = schema.required.map((entry) => (entry === from ? to : entry));
}

/** Finds a property schema on a schema or any of its allOf members. */
function findPropertyInComposition(
  target: OpenApiSchema,
  property: string,
): OpenApiSchema | undefined {
  const direct = target.properties?.[property];
  if (direct !== undefined) return direct;
  for (const member of target.allOf ?? []) {
    const found = member.properties?.[property];
    if (found !== undefined) return found;
  }
  return undefined;
}

/**
 * Strips erroneous `/^…$/` delimiters from `pattern` values.
 *
 * Upstream writes some patterns slash-delimited (e.g. `"/^\\d{11}$/"` for CPF,
 * `"/^\\d{7}$/"` for `codMun`) while writing every other pattern bare (e.g.
 * `"^[0-9A-Z]{14}$"` for CNPJ, `"[a-zA-Z0-9]{26,35}"` for txid). JSON Schema
 * patterns are not delimited; keeping the slashes would force every valid CPF
 * to start and end with a literal `/`. Official examples (e.g. devedor.cpf
 * `"12345678909"`) confirm the intent.
 */
function normalizeSlashDelimitedPatterns(doc: OpenApiDocument): void {
  const walk = (node: unknown, location: string): void => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${location}[${index}]`));
      return;
    }
    if (typeof node !== "object" || node === null) return;
    for (const [key, value] of Object.entries(node)) {
      if (key === "pattern" && typeof value === "string") {
        if (value.startsWith("/^") && value.endsWith("$/") && value.length > 3) {
          (node as Record<string, unknown>)[key] = value.slice(1, -1);
        }
      } else {
        walk(value, `${location}.${key}`);
      }
    }
  };
  walk(doc.components, "components");
}

export const ERRATA: readonly Erratum[] = [
  {
    id: "slash-delimited-pattern",
    location: "e.g. components.schemas.PessoaFisica.properties.cpf.pattern",
    description:
      'Patterns written as delimited regexes ("/^\\d{11}$/") are unwrapped to "^\\d{11}$". JSON Schema patterns carry no delimiters; the same constraints are written bare elsewhere in the file (e.g. CNPJ "^[0-9A-Z]{14}$") and the official example payloads (cpf "12345678909") only validate when unwrapped.',
    apply: normalizeSlashDelimitedPatterns,
  },
  {
    id: "recnotification-required-quote",
    location: "components.schemas.RecNotification.required",
    description:
      'Upstream: required: ["idRec","status",atualizacao"] — a stray trailing quote makes the required key literally `atualizacao"`, which no payload can ever provide. Corrected to `atualizacao`, matching the property declared via RecAtualizacao and the official webhook example recWebhookNotification1.',
    apply: (doc) => {
      const target = schema(doc, "RecNotification");
      // Note the stray trailing quote in the third upstream entry.
      const expected = ["idRec", "status", 'atualizacao"'];
      const actual = target.required ?? [];
      if (
        actual.length !== expected.length ||
        expected.some((entry, index) => actual[index] !== entry)
      ) {
        throw new SpecError(
          `erratum precondition failed: expected required ${JSON.stringify(expected)}, found ${JSON.stringify(actual)}`,
          "components.schemas.RecNotification",
        );
      }
      target.required = ["idRec", "status", "atualizacao"];
    },
  },
  {
    id: "pixconsultados-required-cobs",
    location: "components.schemas.PixConsultados.required",
    description:
      'Upstream requires a property named "cobs", but PixConsultados declares "pix" (copy-paste from CobsConsultadas). The official example getPix1 provides "pix". Renamed cobs → pix.',
    apply: (doc) => {
      const target = schema(doc, "PixConsultados");
      if (target.required?.includes("cobs") !== true) {
        throw new SpecError(
          'erratum precondition failed: "cobs" not in required',
          "PixConsultados",
        );
      }
      renameInRequired(target, "cobs", "pix", "components.schemas.PixConsultados");
    },
  },
  {
    id: "cobbase-infoadicionais-maximum",
    location: "components.schemas.CobBase.properties.infoAdicionais",
    description:
      "Upstream applies `maximum: 50` (a numeric keyword) to an array. JSON Schema ignores it; the evident intent — confirmed by every PSP limiting additional fields — is `maxItems: 50`. Corrected to maxItems.",
    apply: (doc) => {
      const target = mustExist(
        schema(doc, "CobBase").properties?.["infoAdicionais"],
        "CobBase.properties.infoAdicionais",
      );
      if (target.maximum !== 50 || target.type !== "array") {
        throw new SpecError(
          "erratum precondition failed: expected array with maximum: 50",
          "CobBase.properties.infoAdicionais",
        );
      }
      delete target.maximum;
      target.maxItems = 50;
    },
  },
  {
    id: "recbase-required-retentativa",
    location: "components.schemas.RecBase.required",
    description:
      'Upstream requires a property named "retentativa", which no schema declares anywhere. The real configuration field is `politicaRetentativa` — required by RecConfiguracao, which is composed alongside RecBase in every schema that needs it (RecSolicitada, RecCompleta, RecCompletaPesquisada, RecPayload). The requirement is therefore already expressed where the property lives; the undeclared key is dropped from RecBase.required.',
    apply: (doc) => {
      removeFromRequired(schema(doc, "RecBase"), "retentativa", "RecBase.required");
    },
  },
  {
    id: "recbase-required-idrec",
    location: "components.schemas.RecBase.required",
    description:
      'Upstream requires "idRec" from RecBase, but RecBase does not declare idRec (response schemas declare it through their own allOf members, without marking it required). The official POST /rec request examples (recBody1, recBody2) omit idRec entirely — the PSP recebedor assigns it. The undeclared key is dropped from RecBase.required.',
    apply: (doc) => {
      removeFromRequired(schema(doc, "RecBase"), "idRec", "RecBase.required");
    },
  },
  {
    id: "solicrecbase-required-pagador",
    location: "components.schemas.SolicRecBase.required",
    description:
      'Upstream requires a property named "pagador", which neither SolicRecBase nor any composed schema declares; the official request/response examples (solicRecBody1, solicRecResponse1-3) never send it. Dropped from required.',
    apply: (doc) => {
      removeFromRequired(schema(doc, "SolicRecBase"), "pagador", "SolicRecBase.required");
    },
  },
  {
    id: "solicrerec-completa-required-rec",
    location: "components.schemas.SolicRecCompleta.required",
    description:
      'Upstream requires a property named "rec", but the schema declares "recPayload" (the RecPayload reference). All official examples provide recPayload. Renamed rec → recPayload.',
    apply: (doc) => {
      renameInRequired(
        schema(doc, "SolicRecCompleta"),
        "rec",
        "recPayload",
        "SolicRecCompleta.required",
      );
    },
  },
  {
    id: "payloadlocationcob-required-tipocob",
    location: "components.schemas.PayloadLocationCob.required",
    description:
      'Upstream requires "tipoCob", which PayloadLocationCob does not declare (its only property is "id"); the official cob request examples send loc: { id } and the PSP infers tipoCob from the location. Dropped from required.',
    apply: (doc) => {
      removeFromRequired(
        schema(doc, "PayloadLocationCob"),
        "tipoCob",
        "PayloadLocationCob.required",
      );
    },
  },
  {
    id: "payloadlocationrecgerada-required-tipo",
    location: "components.schemas.PayloadLocationRecGerada.required",
    description:
      'Upstream requires "tipo", which PayloadLocationRecGerada does not declare (properties: id, location, criacao); the official examples payloadLocationRecResponse1/2 do not send it. Dropped from required.',
    apply: (doc) => {
      removeFromRequired(
        schema(doc, "PayloadLocationRecGerada"),
        "tipo",
        "PayloadLocationRecGerada.required",
      );
    },
  },
  {
    id: "cobgerada-loc-required-txid",
    location: "components.schemas.CobGerada.properties.loc.required",
    description:
      'The inline `loc` composition requires "txid", but the referenced PayloadLocation schema does not declare txid (only PayloadLocationCompleta does). The official cobResponse1-7 examples never include loc.txid. Undeclared key dropped from required (id, tipoCob and criacao remain, as declared by PayloadLocation).',
    apply: (doc) => {
      const loc = findPropertyInComposition(schema(doc, "CobGerada"), "loc");
      if (loc === undefined) {
        throw new SpecError("erratum precondition failed: CobGerada.loc missing", "CobGerada");
      }
      removeFromRequired(loc, "txid", "CobGerada.properties.loc.required");
    },
  },
  {
    id: "cobvgerada-loc-required-txid",
    location: "components.schemas.CobVGerada.properties.loc.required",
    description:
      'Same upstream defect as cobgerada-loc-required-txid, in the CobV variant: loc requires "txid", undeclared by the referenced PayloadLocation. Dropped from required.',
    apply: (doc) => {
      const loc = findPropertyInComposition(schema(doc, "CobVGerada"), "loc");
      if (loc === undefined) {
        throw new SpecError("erratum precondition failed: CobVGerada.loc missing", "CobVGerada");
      }
      removeFromRequired(loc, "txid", "CobVGerada.properties.loc.required");
    },
  },
  {
    id: "dadosrecebedor-top-level-required",
    location: "components.schemas.DadosRecebedor.required",
    description:
      "Upstream marks logradouro/cidade/uf/cep as required at the DadosRecebedor level, i.e. as TOP-LEVEL properties of every schema that composes it (CobVGerada, CobVCompleta, CobVPayload) — those keys are not declared there, and no official example (cobResponse4-7, cobPayload2/5) provides them at top level. The intended constraint (address required inside `recebedor`) is already expressed by the recebedor composition itself (allOf member `required: [logradouro, cidade, uf, cep]` + DadosComplementaresPessoa), which is kept intact. The spurious top-level required list is dropped.",
    apply: (doc) => {
      const target = schema(doc, "DadosRecebedor");
      assertRequiredList(target, "components.schemas.DadosRecebedor", [
        "logradouro",
        "cidade",
        "uf",
        "cep",
      ]);
      const recebedor = target.properties?.["recebedor"];
      const allOf = recebedor?.allOf;
      if (
        recebedor === undefined ||
        !allOf?.some(
          (member) =>
            member.required !== undefined &&
            ["logradouro", "cidade", "uf", "cep"].every((key) => member.required?.includes(key)),
        )
      ) {
        throw new SpecError(
          "erratum precondition failed: expected recebedor.allOf member requiring the address fields",
          "DadosRecebedor.properties.recebedor",
        );
      }
      delete target.required;
    },
  },
  {
    id: "retirada-oneof-required-branches",
    location:
      "components.schemas.CobValor.properties.retirada.oneOf + CobPayloadValor.properties.retirada.oneOf",
    description:
      'The retirada oneOf branches declare `saque`/`troco` as optional properties, so ANY object matches BOTH branches (an unsatisfiable constraint: nothing can ever validate). The spec\'s own prose requires exclusivity ("Apenas um agrupamento por vez é permitido, quando há `saque` não há `troco` e vice-versa"). `required: ["saque"]` / `required: ["troco"]` are added to the respective branches, making them discriminating.',
    apply: (doc) => {
      for (const name of ["CobValor", "CobPayloadValor"] as const) {
        const retirada = schema(doc, name).properties?.["retirada"];
        const branches = retirada?.oneOf;
        if (branches?.length !== 2) {
          throw new SpecError(
            "erratum precondition failed: expected retirada.oneOf with 2 branches",
            name,
          );
        }
        for (const branch of branches) {
          const declared = Object.keys(branch.properties ?? {});
          if (declared.length !== 1 || !["saque", "troco"].includes(declared[0]!)) {
            throw new SpecError(
              `erratum precondition failed: unexpected retirada branch [${declared.join(", ")}]`,
              `${name}.retirada`,
            );
          }
          branch.required = [declared[0]!];
        }
      }
    },
  },
  {
    id: "recrevisada-devedor-identical-oneof",
    location: "components.schemas.RecRevisada.properties.vinculo.properties.devedor.oneOf",
    description:
      "The devedor oneOf has two character-identical branches (each `{ required: [nome], properties: { nome: … } }`), so every payload matches both — an unsatisfiable constraint. The oneOf is collapsed to the single (identical) branch it contains.",
    apply: (doc) => {
      const vinculo = findPropertyInComposition(schema(doc, "RecRevisada"), "vinculo");
      const devedor = mustExist(vinculo?.properties?.["devedor"], "RecRevisada.vinculo.devedor");
      const branches = devedor.oneOf;
      if (branches?.length !== 2) {
        throw new SpecError(
          "erratum precondition failed: expected devedor.oneOf with 2 branches",
          "RecRevisada",
        );
      }
      const [first, second] = branches;
      if (first === undefined || second === undefined) {
        throw new SpecError("erratum precondition failed: empty devedor branch", "RecRevisada");
      }
      // The branches differ only in their `title` (Pessoa Física vs Pessoa
      // Jurídica); their validation shape must be identical for this erratum.
      const shapeOf = (branch: OpenApiSchema): unknown => ({
        required: branch.required,
        properties: branch.properties,
        type: branch.type,
      });
      if (JSON.stringify(shapeOf(first)) !== JSON.stringify(shapeOf(second))) {
        throw new SpecError(
          "erratum precondition failed: devedor oneOf branches differ in validation shape",
          "RecRevisada",
        );
      }
      delete devedor.oneOf;
      Object.assign(devedor, first);
    },
  },
  {
    id: "encerramento-oneof-required-branches",
    location:
      "components.schemas.RecEncerramento.properties.encerramento.oneOf + CobRAtualizacao.properties.encerramento.oneOf",
    description:
      'Same defect as retirada-oneof-required-branches: the encerramento oneOf branches declare `rejeicao`/`cancelamento` as optional, making the constraint unsatisfiable (any object matches both). The spec prose distinguishes encerramento "POR rejeição" vs "POR cancelamento". `required: ["rejeicao"]` / `required: ["cancelamento"]` are added to the respective branches.',
    apply: (doc) => {
      for (const name of ["RecEncerramento", "CobRAtualizacao"] as const) {
        const encerramento = schema(doc, name).properties?.["encerramento"];
        const branches = encerramento?.oneOf;
        if (branches?.length !== 2) {
          throw new SpecError(
            "erratum precondition failed: expected encerramento.oneOf with 2 branches",
            name,
          );
        }
        for (const branch of branches) {
          const declared = Object.keys(branch.properties ?? {});
          if (declared.length !== 1 || !["rejeicao", "cancelamento"].includes(declared[0]!)) {
            throw new SpecError(
              `erratum precondition failed: unexpected encerramento branch [${declared.join(", ")}]`,
              `${name}.encerramento`,
            );
          }
          branch.required = [declared[0]!];
        }
      }
    },
  },
  {
    id: "componentesvalor-anyof-required-branches",
    location:
      "components.schemas.Pix.properties.componentesValor.anyOf + PixAutomatico.properties.componentesValor.anyOf (branch targets PixValor*)",
    description:
      'The componentesValor anyOf branches are $refs to PixValor* schemas that declare their single field (original/saque/troco/juros/multa/abatimento/desconto) as optional, so the union is vacuous: every possible object — including {} — matches at least one branch, and the constraint can never reject anything. The spec\'s own valid examples always populate the field of one branch ("componentesValor" exists to explain composed value elements). `required` is added to each referenced PixValor* schema so the union actually discriminates.',
    apply: (doc) => {
      const referenced = new Set<string>();
      for (const name of ["Pix", "PixAutomatico"] as const) {
        const componentes = schema(doc, name).properties?.["componentesValor"];
        const branches = componentes?.anyOf;
        if (componentes === undefined || branches === undefined || branches.length < 2) {
          throw new SpecError("erratum precondition failed: expected componentesValor.anyOf", name);
        }
        for (const branch of branches) {
          if (branch.$ref === undefined) {
            throw new SpecError(
              "erratum precondition failed: expected $ref branches",
              `${name}.componentesValor`,
            );
          }
          referenced.add(refName(branch.$ref, SCHEMAS_PREFIX, `${name}.componentesValor`));
        }
      }
      for (const targetName of referenced) {
        const target = schema(doc, targetName);
        const declared = Object.keys(target.properties ?? {});
        if (declared.length !== 1 || target.required !== undefined) {
          throw new SpecError(
            `erratum precondition failed: expected a single optional property on ${targetName}`,
            targetName,
          );
        }
        target.required = [declared[0]!];
      }
    },
  },
  {
    id: "dadospagadorrec-required-ispb",
    location: "components.schemas.DadosPagadorRec.required",
    description:
      'Upstream requires "ispbParticipante" at the DadosPagadorRec top level, but the property is declared inside `pagador` (allOf member), not at the top. Every official example (recResponse3-8, getRec1) provides ispbParticipante inside `pagador`. The requirement is moved to where the property lives: pagador.allOf[0].required gains "ispbParticipante" and the spurious top-level entry is dropped.',
    apply: (doc) => {
      const target = schema(doc, "DadosPagadorRec");
      const pagador = target.properties?.["pagador"];
      const ispbMember = pagador?.allOf?.find(
        (member) => member.properties?.["ispbParticipante"] !== undefined,
      );
      if (
        pagador === undefined ||
        ispbMember === undefined ||
        target.required?.includes("ispbParticipante") !== true
      ) {
        throw new SpecError(
          "erratum precondition failed: expected required [ispbParticipante] and pagador.allOf member declaring it",
          "DadosPagadorRec",
        );
      }
      delete target.required;
      ispbMember.required = ["ispbParticipante"];
    },
  },
  {
    id: "cobvgerada-required-location",
    location: "components.schemas.CobVGerada.required",
    description:
      'Upstream requires a top-level "location" property, but no allOf member of CobVGerada declares it (CobGerada has an equivalent member; it was lost in the CobV copy). The official example cobResponse4 carries `location` only inside `loc`, not at top level. The undeclared key is dropped from required.',
    apply: (doc) => {
      removeFromRequired(schema(doc, "CobVGerada"), "location", "CobVGerada.required");
    },
  },
  {
    id: "cobsconsultadas-items-required-idcob",
    location:
      "components.schemas.CobsConsultadas.properties.cobs.items + CobsVConsultadas.properties.cobs.items",
    description:
      'The per-item composition requires "idCob", a property no schema in the entire file declares (status and txid are kept — both are declared by CobCompleta/CobVCompleta). The official list examples never carry idCob. Dropped from required.',
    apply: (doc) => {
      for (const name of ["CobsConsultadas", "CobsVConsultadas"] as const) {
        const items = schema(doc, name).properties?.["cobs"]?.items;
        const bareRequired = items?.allOf?.find(
          (member) => member.required?.includes("idCob") === true,
        );
        if (items === undefined || bareRequired?.required === undefined) {
          throw new SpecError(
            "erratum precondition failed: expected items.allOf member requiring idCob",
            `${name}.properties.cobs.items`,
          );
        }
        bareRequired.required = bareRequired.required.filter((entry) => entry !== "idCob");
      }
    },
  },
  {
    id: "location-path-id-int64",
    location:
      "paths./loc/{id}, paths./loc/{id}/txid, paths./locrec/{id}, paths./locrec/{id}/idRec (parameters[0].schema)",
    description:
      'Upstream declares these four path parameters as bare `type: string`, but the identifiers they address are int64: `components.schemas.PayloadLocationId` (`type: integer, format: int64`) and `PayloadLocationRecId` (same). A string path parameter is the textual form of that id, so it must be a decimal int64 — not arbitrary text. Upstream string typing let `client.loc.get("1/../../x")` be interpolated into `GET /loc/1%2F..%2F..%2Fx`. `format: int64` is added while keeping `type: string` (path parameters are always textual); generated path validators then reject traversal, non-numeric values and int64 overflow.',
    apply: (doc) => {
      const targets: readonly (readonly [string, string])[] = [
        ["/loc/{id}", "id"],
        ["/loc/{id}/txid", "id"],
        ["/locrec/{id}", "id"],
        ["/locrec/{id}/idRec", "id"],
      ];
      for (const [path, name] of targets) {
        const location = `paths.${path}.parameters`;
        const parameter = mustExist(
          (doc.paths[path]?.parameters ?? []).find((entry) => entry.name === name),
          location,
        );
        const schema = mustExist(parameter.schema, `${location}.${name}.schema`);
        if (schema.type !== "string" || schema.format !== undefined) {
          throw new SpecError(
            `erratum precondition failed: expected bare type:string schema, found type=${String(schema.type)} format=${String(schema.format)}`,
            `${location}.${name}.schema`,
          );
        }
        schema.format = "int64";
      }
    },
  },
];

export function errataInfo(): readonly SpecErratumInfo[] {
  return ERRATA.map(({ id, location, description }) => ({ id, location, description }));
}

/** Applies every erratum in order; throws SpecError when one no longer matches. */
export function applyErrata(doc: OpenApiDocument): void {
  for (const erratum of ERRATA) {
    erratum.apply(doc);
  }
}
