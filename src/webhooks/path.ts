/**
 * Path handling for webhook receivers.
 *
 * Many PSPs append the callback family to the URL registered for a webhook:
 * a webhook configured as `https://example.com/hooks` is called at
 * `https://example.com/hooks/pix` (or `/rec`, `/cob`, ...). The BCB OpenAPI
 * callbacks use exactly that shape (`{$request.body#/webhookUrl}/pix`). This
 * module makes that quirk configurable for all three adapters.
 */

/** How a trailing PSP-appended callback segment is treated. */
export type WebhookPathSuffixMode = "strip" | "reject" | "ignore";

export interface WebhookPathOptions {
  /**
   * `strip` (default) removes a recognized trailing suffix before matching;
   * `reject` treats suffixed paths as unmatched; `ignore` keeps them verbatim.
   */
  readonly pathSuffix?: WebhookPathSuffixMode;
  /** Segments considered PSP-appended. Defaults to the five BCB callback kinds. */
  readonly suffixes?: readonly string[];
  /** When set, only this path (optionally plus one suffix) is accepted. */
  readonly basePath?: string;
}

export interface NormalizedWebhookPath {
  /** Effective pathname (suffix removed in `strip` mode). */
  readonly path: string;
  /** The removed/rejected suffix, when one was present. */
  readonly suffix: string | undefined;
  /** Whether the path is a webhook path for this configuration. */
  readonly accepted: boolean;
}

const DEFAULT_SUFFIXES = ["pix", "rec", "cob", "cobv", "cobr"] as const;

function normalizePathname(raw: string): string {
  const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;
  // Keep a single trailing slash only for the root path; strip it elsewhere so
  // `/hooks/` and `/hooks` behave identically.
  const trimmed = withLeadingSlash.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/** Extracts the pathname from a request target (which may contain a query). */
export function webhookPathname(url: string): string {
  const path = url.split(/[?#]/, 1)[0] ?? "/";
  return normalizePathname(path);
}

/**
 * Normalizes an incoming webhook pathname according to `options`.
 */
export function normalizeWebhookPath(
  url: string,
  options: WebhookPathOptions = {},
): NormalizedWebhookPath {
  const path = webhookPathname(url);
  const mode = options.pathSuffix ?? "strip";
  const suffixes = options.suffixes ?? DEFAULT_SUFFIXES;
  const segments = path === "/" ? [] : path.slice(1).split("/");
  const last = segments.at(-1);
  const hasSuffix =
    last !== undefined && suffixes.some((s) => s.toLowerCase() === last.toLowerCase());
  const suffix = hasSuffix ? last : undefined;

  if (hasSuffix && mode === "reject") {
    return { path, suffix, accepted: false };
  }

  const effective =
    hasSuffix && mode === "strip"
      ? normalizePathname(segments.slice(0, -1).join("/") || "/")
      : path;

  const base = options.basePath === undefined ? undefined : normalizePathname(options.basePath);
  if (base === undefined) {
    return { path: effective, suffix, accepted: true };
  }
  const accepted = effective === base;
  return { path: effective, suffix, accepted };
}
