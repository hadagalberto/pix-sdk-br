/** Path-suffix quirk handling used by all webhook adapters. */

import { describe, expect, it } from "vitest";
import { normalizeWebhookPath, webhookPathname } from "../src/webhooks/path.js";

describe("webhookPathname", () => {
  it.each([
    ["/hooks", "/hooks"],
    ["/hooks/", "/hooks"],
    ["/hooks?token=abc", "/hooks"],
    ["/hooks/pix#frag", "/hooks/pix"],
    ["hooks", "/hooks"],
    ["/", "/"],
    ["/a//b", "/a//b"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(webhookPathname(input)).toBe(expected);
  });
});

describe("normalizeWebhookPath — default strip mode", () => {
  it.each(["pix", "rec", "cob", "cobv", "cobr"])("strips /%s", (suffix) => {
    expect(normalizeWebhookPath(`/hooks/${suffix}`)).toEqual({
      path: "/hooks",
      suffix,
      accepted: true,
    });
  });

  it("leaves a plain path untouched", () => {
    expect(normalizeWebhookPath("/hooks")).toEqual({
      path: "/hooks",
      suffix: undefined,
      accepted: true,
    });
  });

  it("does not treat unknown segments as suffixes", () => {
    expect(normalizeWebhookPath("/hooks/custom")).toEqual({
      path: "/hooks/custom",
      suffix: undefined,
      accepted: true,
    });
  });

  it("handles the root path with a suffix", () => {
    expect(normalizeWebhookPath("/pix")).toEqual({ path: "/", suffix: "pix", accepted: true });
  });
});

describe("normalizeWebhookPath — configurable handling", () => {
  it("rejects suffixed paths in reject mode", () => {
    expect(normalizeWebhookPath("/hooks/pix", { pathSuffix: "reject" })).toEqual({
      path: "/hooks/pix",
      suffix: "pix",
      accepted: false,
    });
  });

  it("keeps suffixed paths verbatim in ignore mode", () => {
    expect(normalizeWebhookPath("/hooks/rec", { pathSuffix: "ignore" })).toEqual({
      path: "/hooks/rec",
      suffix: "rec",
      accepted: true,
    });
  });

  it("accepts only the configured base path (with or without suffix)", () => {
    const options = { basePath: "/hooks" };
    expect(normalizeWebhookPath("/hooks", options).accepted).toBe(true);
    expect(normalizeWebhookPath("/hooks/cobv", options)).toEqual({
      path: "/hooks",
      suffix: "cobv",
      accepted: true,
    });
    expect(normalizeWebhookPath("/other/pix", options).accepted).toBe(false);
  });

  it("supports custom suffix vocabularies", () => {
    const options = { suffixes: ["custom"], basePath: "/hooks" };
    expect(normalizeWebhookPath("/hooks/custom", options)).toEqual({
      path: "/hooks",
      suffix: "custom",
      accepted: true,
    });
    expect(normalizeWebhookPath("/hooks/pix", options).accepted).toBe(false);
  });

  it("matches suffixes case-insensitively and preserves the original casing", () => {
    expect(normalizeWebhookPath("/hooks/PIX")).toEqual({
      path: "/hooks",
      suffix: "PIX",
      accepted: true,
    });
  });

  it("normalizes a trailing slash on the configured base path", () => {
    expect(normalizeWebhookPath("/hooks/pix", { basePath: "/hooks/" }).path).toBe("/hooks");
  });
});
