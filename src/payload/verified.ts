/** Glue between the payload HTTP resource and the JWS verifier. */

import type { CallOptions } from "../client/client.js";
import { verifyJws } from "./jws.js";
import type { JwsVerifyOptions, PayloadSchema, VerifiedJws } from "./jws.js";

/** Options for fetching a payload from a location (token or absolute URL). */
export interface PayloadFetchOptions extends CallOptions {
  /**
   * Extra hosts trusted for absolute `location` URLs. The API base host is
   * always trusted; every other host must be listed here explicitly.
   */
  readonly allowedLocationHosts?: string | readonly string[];
  /** TEST ONLY — allow plain `http:` absolute location URLs. */
  readonly insecureAllowHttpLocationForTesting?: boolean;
}

/** Options for `client.payload.fetchVerified(location)`. */
export interface PayloadFetchVerifiedOptions extends JwsVerifyOptions, PayloadFetchOptions {}

/** Selects the expected payload schema from the location URL shape. */
export function inferPayloadSchema(location: string): PayloadSchema {
  const path = location.split(/[?#]/, 1)[0] ?? location;
  const segments = path.split("/").filter((segment) => segment.length > 0);
  if (segments.some((segment) => segment.toLowerCase() === "cobv")) return "cobv";
  if (segments.some((segment) => segment.toLowerCase() === "rec")) return "rec";
  return "cob";
}

/** Resolves a location (absolute URL, scheme-less host, relative URL or bare token) for host checks. */
export function resolveLocationUrl(location: string, baseUrl: URL | undefined): string | undefined {
  const trimmed = location.trim();
  if (trimmed === "") return undefined;
  try {
    // BR Codes embed the location without its scheme ("pix.psp.example/qr/...").
    // That is an absolute host, not a path on the client's baseUrl.
    if (/^[^/?#]+\.[^/?#]+\//.test(trimmed) && !/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
      return new URL(`https://${trimmed}`).toString();
    }
    return new URL(trimmed, baseUrl).toString();
  } catch {
    return undefined;
  }
}

/**
 * Whether a location string identifies a URL (as opposed to a bare Pix
 * payload token that must be sent to a spec operation on `baseUrl`).
 */
export function isLocationUrl(location: string): boolean {
  const trimmed = location.trim();
  return (
    /^https?:\/\//i.test(trimmed) || trimmed.startsWith("/") || /^[^/?#]+\.[^/?#]+\//.test(trimmed)
  );
}

/** Verifies a JWS fetched from a Pix location. */
export function verifyLocationJws<T = unknown>(
  jws: string,
  location: string,
  baseUrl: URL | undefined,
  options: PayloadFetchVerifiedOptions = {},
): Promise<VerifiedJws<T>> {
  const payloadSchema = options.payloadSchema ?? inferPayloadSchema(location);
  const locationUrl = options.locationUrl ?? resolveLocationUrl(location, baseUrl);
  return verifyJws<T>(jws, {
    ...options,
    payloadSchema,
    ...(locationUrl === undefined ? {} : { locationUrl }),
  });
}
