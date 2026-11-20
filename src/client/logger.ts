/**
 * Structured logging hook for the Pix client.
 *
 * The SDK never logs directly: callers supply a logger (or rely on the no-op
 * default). Log context values are shallow, JSON-friendly records. Secrets
 * (client secret, bearer tokens, private keys) are NEVER placed in context.
 */

/** A single structured log event context. */
export type LogContext = Readonly<Record<string, unknown>>;

export type LogLevel = "debug" | "info" | "warn" | "error";

/** Minimal logger interface compatible with `console`, pino, winston, etc. */
export interface PixLogger {
  debug?(message: string, context?: LogContext): void;
  info?(message: string, context?: LogContext): void;
  warn?(message: string, context?: LogContext): void;
  error?(message: string, context?: LogContext): void;
}

/** Logger normalized to four always-present methods. */
export type ResolvedLogger = Required<PixLogger>;

/** A logger that discards every event. */
export const noopLogger: ResolvedLogger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

/** Fills missing log levels with no-ops so call sites need no optional calls. */
export function resolveLogger(logger: PixLogger | undefined): ResolvedLogger {
  if (logger === undefined) return noopLogger;
  return {
    debug: (message, context) => logger.debug?.(message, context),
    info: (message, context) => logger.info?.(message, context),
    warn: (message, context) => logger.warn?.(message, context),
    error: (message, context) => logger.error?.(message, context),
  };
}
