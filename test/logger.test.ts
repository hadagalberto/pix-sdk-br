/** Logger normalization and no-op behaviour. */

import { describe, expect, it, vi } from "vitest";
import { noopLogger, resolveLogger } from "../src/client/logger.js";

describe("logger", () => {
  it("noopLogger exposes four safe methods", () => {
    expect(() => {
      noopLogger.debug("debug");
      noopLogger.info("info", { n: 1 });
      noopLogger.warn("warn");
      noopLogger.error("error");
    }).not.toThrow();
  });

  it("resolves undefined to the no-op logger", () => {
    expect(resolveLogger(undefined)).toBe(noopLogger);
  });

  it("fills missing levels with no-ops and forwards existing ones", () => {
    const warn = vi.fn();
    const resolved = resolveLogger({ warn });
    expect(() => {
      resolved.debug("debug");
      resolved.info("info");
      resolved.error("error");
    }).not.toThrow();
    resolved.warn("careful", { attempt: 2 });
    expect(warn).toHaveBeenCalledWith("careful", { attempt: 2 });
  });

  it("keeps every provided level", () => {
    const methods = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const resolved = resolveLogger(methods);
    resolved.debug("d");
    resolved.info("i");
    resolved.warn("w");
    resolved.error("e");
    expect(methods.debug).toHaveBeenCalledOnce();
    expect(methods.info).toHaveBeenCalledOnce();
    expect(methods.warn).toHaveBeenCalledOnce();
    expect(methods.error).toHaveBeenCalledOnce();
  });
});
