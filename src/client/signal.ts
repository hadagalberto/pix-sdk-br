/** Abort/timeout helpers shared by the OAuth and HTTP layers. */

export interface TimeoutHandle {
  readonly signal: AbortSignal;
  /** True when the timeout (not the caller) aborted the signal. */
  readonly timedOut: () => boolean;
  /** Detach listeners and cancel the timer. Safe to call more than once. */
  clear(): void;
}

/**
 * Links a caller signal with a timeout. A caller abort propagates its reason;
 * a timeout aborts with an `Error` carrying a clear message. `clear()` must be
 * called in a `finally` block to avoid leaking listeners/timers.
 */
export function withTimeout(
  callerSignal: AbortSignal | undefined,
  timeoutMs: number,
): TimeoutHandle {
  const controller = new AbortController();
  let timedOut = false;
  let cleared = false;

  const propagate = (): void => {
    controller.abort(callerSignal?.reason);
  };
  if (callerSignal !== undefined) {
    if (callerSignal.aborted) {
      controller.abort(callerSignal.reason);
    } else {
      callerSignal.addEventListener("abort", propagate, { once: true });
    }
  }

  const timer =
    timeoutMs > 0 && Number.isFinite(timeoutMs)
      ? setTimeout(() => {
          timedOut = true;
          controller.abort(new Error(`Request timed out after ${String(timeoutMs)}ms`));
        }, timeoutMs)
      : undefined;

  return {
    signal: controller.signal,
    timedOut: () => timedOut,
    clear: () => {
      if (cleared) return;
      cleared = true;
      if (timer !== undefined) clearTimeout(timer);
      callerSignal?.removeEventListener("abort", propagate);
    },
  };
}

/** Whether an abort error came from our timeout rather than the caller. */
export function wasAborted(signal: AbortSignal | undefined): boolean {
  return signal?.aborted === true;
}
