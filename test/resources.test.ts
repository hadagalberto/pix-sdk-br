/** Resource coverage: every pagination iterator and payload-URL dispatch. */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PixClient } from "../src/client/client.js";
import { requestBodyExamples } from "../src/generated/examples.js";
import { requestBodyValidators } from "../src/generated/validators.js";
import { generateTxid } from "../src/txid.js";
import { startMockServer, type MockServer } from "./mock-server/server.js";

let server: MockServer;
let client: PixClient;

const LIST_QUERY = {
  inicio: "2026-01-01T00:00:00Z",
  fim: "2026-12-31T23:59:59Z",
  "paginacao.itensPorPagina": 1,
} as const;

const FALLBACK_BODIES: Readonly<Record<string, unknown>> = {
  WebhookCobConfigBody: { webhookUrl: "https://example.com/webhookcob" },
  WebhookCobVConfigBody: { webhookUrl: "https://example.com/webhookcobv" },
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function bodyOf<T>(name: string): T {
  const validator = requestBodyValidators[name];
  let example = (requestBodyExamples[name] ?? []).find((item) => validator?.(item).ok === true);
  if (example === undefined && name === "CobVBody") {
    const repaired = repairModalidades(requestBodyExamples[name]?.[0]);
    if (validator?.(repaired).ok === true) example = repaired;
  }
  const candidate = example ?? FALLBACK_BODIES[name];
  if (candidate === undefined || validator?.(candidate).ok !== true) {
    throw new Error(`no known-valid example for ${name}`);
  }
  return candidate as T;
}

function repairModalidades(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(repairModalidades);
  if (typeof value !== "object" || value === null) return value;
  const record: Record<string, unknown> = { ...(value as Record<string, unknown>) };
  for (const [key, child] of Object.entries(record)) record[key] = repairModalidades(child);
  const modalidade = record["modalidade"];
  if (typeof modalidade === "string" && /^\d+$/.test(modalidade)) {
    record["modalidade"] = Number(modalidade);
  }
  return record;
}

async function collect<T>(iterator: AsyncGenerator<T>): Promise<readonly T[]> {
  const items: T[] = [];
  for await (const item of iterator) items.push(item);
  return items;
}

beforeAll(async () => {
  server = await startMockServer();
  client = new PixClient({
    baseUrl: server.baseUrl,
    clientId: "mock-client",
    clientSecret: "mock-secret",
    certificate: {
      cert: server.certificates.clientCertPem,
      key: server.certificates.clientKeyPem,
      ca: server.certificates.caCertPem,
    },
    retry: false,
  });
});

afterAll(async () => {
  await client.close();
  await server.close();
});

describe("pagination async iterators", () => {
  it("walks pages of cob, cobv and lotecobv lists", async () => {
    const cobTxid = generateTxid();
    const cobvTxid = generateTxid();
    await client.cob.createWithTxid(cobTxid, bodyOf("CobBody"));
    await client.cobv.createWithTxid(cobvTxid, bodyOf("CobVBody"));
    await client.lotecobv.create(bodyOf("LoteCobVBody"));

    await expect(collect(client.cob.listAll(LIST_QUERY))).resolves.toHaveLength(1);
    await expect(collect(client.cobv.listAll(LIST_QUERY))).resolves.toHaveLength(1);
    await expect(collect(client.lotecobv.listAll(LIST_QUERY))).resolves.toHaveLength(1);
  });

  it("walks pages of loc, locrec, pix, rec and cobr lists", async () => {
    await client.loc.create(bodyOf("PayloadLocationBody"));
    await client.locrec.create({});
    await client.pix.get("a".repeat(32));
    await client.rec.create(bodyOf("RecBody"));
    await client.cobr.createWithTxid(generateTxid(), bodyOf("CobRBody"));

    await expect(collect(client.loc.listAll(LIST_QUERY))).resolves.toHaveLength(1);
    await expect(collect(client.locrec.listAll(LIST_QUERY))).resolves.toHaveLength(1);
    await expect(collect(client.pix.listAll(LIST_QUERY))).resolves.toHaveLength(1);
    await expect(collect(client.rec.listAll(LIST_QUERY))).resolves.toHaveLength(1);
    await expect(collect(client.cobr.listAll(LIST_QUERY))).resolves.toHaveLength(1);
  });

  it("walks the paginated webhook collection and rejects non-paginated families", async () => {
    await client.webhook.configure("12345678909", bodyOf("WebhookConfigBody"));
    await client.webhookCob.configure(bodyOf("WebhookCobConfigBody"));

    await expect(collect(client.webhook.listAll())).resolves.toHaveLength(1);
    expect(() => client.webhookCob.listAll()).toThrow(/no paginated list endpoint/);
  });
});

describe("payload location dispatch", () => {
  it("fetches the actual location URL and uses a spec operation only for bare tokens", async () => {
    // Review finding: the old test asserted that full URLs were reduced to
    // their last segment and sent to baseUrl. That was the bug; the corrected
    // expectation is the exact URL the caller supplied.
    const fetched: string[] = [];
    const urlClient = new PixClient({
      baseUrl: "https://api.psp.example/v2/",
      clientId: "id",
      clientSecret: "secret",
      fetch: (url) => {
        fetched.push(url);
        return Promise.resolve({
          status: 200,
          headers: { get: () => "application/jose" },
          text: () => Promise.resolve("jws"),
        });
      },
    });
    const locationOptions = { allowedLocationHosts: ["psp.example"] };
    await urlClient.payload.get("https://psp.example/pix/token-a", locationOptions);
    await urlClient.payload.get("https://psp.example/cobv/token-b", locationOptions);
    await urlClient.payload.get("https://psp.example/rec/token-c", locationOptions);
    expect(fetched).toEqual([
      "https://psp.example/pix/token-a",
      "https://psp.example/cobv/token-b",
      "https://psp.example/rec/token-c",
    ]);
    await urlClient.close();

    server.reset();
    await client.payload.fetch("bare-token");
    expect(server.exchanges.map((exchange) => exchange.operation)).toEqual([
      "GetPixUrlAccessToken",
    ]);
    expect(server.exchanges.every((exchange) => exchange.status === 200)).toBe(true);
  });
});
