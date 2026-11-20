/**
 * Public entry point for strict X.509 extension inspection. Re-exported here
 * so chain-validation tests (and callers) can read the exact extensions the
 * verifier enforces without depending on the internal parser file name.
 */

export { readChainExtensions } from "./certificate-extensions.js";
export type { ChainExtensions } from "./certificate-extensions.js";
