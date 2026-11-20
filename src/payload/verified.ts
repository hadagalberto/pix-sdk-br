/** Glue between the payload HTTP resource and the JWS verifier. */

import type { CallOptions } from "../client/client.js";
import { verifyJws } from "./jws.js";
import type { JwsVerifyOptions, PayloadSchema, VerifiedJws } from "./jws.js";

/** Options for `client.payload.fetchVerified(location)`. */
export interface PayloadFetchVerifiedOptions extends JwsVerifyOptions, CallOptions {}

/** Selects the expected payload schema from the location URL shape. */
export function inferPayloadSchema(location: string): PayloadSchema {
  const path = location.split(/[?#]/, 1)[0] ?? location;
  const segments = path.split("/").filter((segment) => segment.length > 0);
  if (segments.some((segment) => segment.toLowerCase() === "cobv")) return "cobv";
  if (segments.some((segment) => segment.toLowerCase() === "rec")) return "rec";
  return "cob";
}

/** Resolves a location (absolute URL, relative URL or bare token) for host checks. */
export function resolveLocationUrl(location: string, baseUrl: URL | undefined): string | undefined {
  try {
    return new URL(location, baseUrl).toString();
  } catch {
    return undefined;
  }
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
