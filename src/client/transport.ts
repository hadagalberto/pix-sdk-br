/** Thin transport abstraction over undici (default) or an injected fetch. */

import { request as undiciRequest, type Dispatcher } from "undici";
import type { HttpFetch, HttpFetchInit } from "./types.js";

type IncomingHeaderValue = string | string[] | undefined;

export interface TransportResponse {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly text: string;
  /** Final URL after redirects, when the adapter exposes it. */
  readonly url?: string;
}

export interface TransportConfig {
  readonly fetch?: HttpFetch;
  readonly dispatcher?: Dispatcher;
}

/** Headers the SDK inspects on responses. */
const OBSERVED_HEADERS = ["content-type", "retry-after", "www-authenticate"] as const;

function undiciHeaderValue(value: IncomingHeaderValue): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

function normalizeUndiciHeaders(
  source: Record<string, IncomingHeaderValue>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [name, value] of Object.entries(source)) {
    const single = undiciHeaderValue(value);
    if (single !== undefined) result[name.toLowerCase()] = single;
  }
  return result;
}

function normalizeFetchHeaders(source: {
  get(name: string): string | null;
}): Record<string, string> {
  const result: Record<string, string> = {};
  for (const name of OBSERVED_HEADERS) {
    const value = source.get(name);
    if (value !== null) result[name] = value;
  }
  return result;
}

/** Executes one HTTP request with either the pluggable fetch or undici. */
export async function sendRequest(
  url: string,
  init: HttpFetchInit,
  config: TransportConfig,
): Promise<TransportResponse> {
  if (config.fetch !== undefined) {
    const response = await config.fetch(url, init);
    return {
      status: response.status,
      headers: normalizeFetchHeaders(response.headers),
      text: await response.text(),
      ...(response.url === undefined ? {} : { url: response.url }),
    };
  }

  // Methods originate from the generated OPERATIONS registry (a fixed set of
  // valid HTTP verbs); the cast bridges the public `string` to undici's union.
  const options: {
    method: Dispatcher.HttpMethod;
    headers: Record<string, string>;
    signal: AbortSignal;
    body?: string;
    dispatcher?: Dispatcher;
  } = {
    method: init.method.toUpperCase() as Dispatcher.HttpMethod,
    headers: { ...init.headers },
    signal: init.signal,
  };
  if (init.body !== undefined) options.body = init.body;
  if (config.dispatcher !== undefined) options.dispatcher = config.dispatcher;

  const response = await undiciRequest(url, options);
  return {
    status: response.statusCode,
    headers: normalizeUndiciHeaders(response.headers),
    text: await response.body.text(),
  };
}
