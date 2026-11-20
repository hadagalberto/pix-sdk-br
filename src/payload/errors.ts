/** Errors raised while fetching and verifying signed Pix payloads. */

import { PixError } from "../client/errors.js";

/** Stable reason codes for `PixJwsError`. */
export type JwsFailureCode =
  | "INVALID_COMPACT"
  | "INVALID_BASE64URL"
  | "INVALID_HEADER"
  | "UNSUPPORTED_ALG"
  | "MISSING_KEY_SOURCE"
  | "KEY_FETCH_FAILED"
  | "INVALID_KEY"
  | "CERT_CHAIN_INVALID"
  | "CERT_NOT_YET_VALID"
  | "CERT_EXPIRED"
  | "HOSTNAME_MISMATCH"
  | "BAD_SIGNATURE"
  | "INVALID_PAYLOAD";

/** Failure while verifying a location JWS or validating its payload. */
export class PixJwsError extends PixError {
  readonly code: JwsFailureCode;
  readonly detail: string | undefined;

  constructor(
    code: JwsFailureCode,
    message: string,
    options?: {
      readonly detail?: string;
      readonly cause?: unknown;
    },
  ) {
    super(message, options);
    this.name = "PixJwsError";
    this.code = code;
    this.detail = options?.detail;
  }
}
