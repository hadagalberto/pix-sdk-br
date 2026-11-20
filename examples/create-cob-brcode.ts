/**
 * Create a Pix cobrança imediata (cob) and print its BR Code.
 *
 * Usage (after `npm run build` or with `npx tsx`):
 *   PIX_PSP=efi PIX_ENV=sandbox \
 *   PIX_CLIENT_ID=... PIX_CLIENT_SECRET=... \
 *   PIX_CERT_PFX=./certificate.p12 PIX_KEY=your-pix-key \
 *   npx tsx examples/create-cob-brcode.ts
 *
 * No real requests are made by CI: this file is only type-checked there.
 */

import { readFileSync } from "node:fs";
import {
  PixClient,
  generateBrCode,
  generateTxid,
  fromReais,
  isPspId,
  parsePspEnvironment,
  presetClientOptions,
} from "../src/index.js";

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") throw new Error(`${name} is required`);
  return value;
}

const psp = process.env["PIX_PSP"] ?? "efi";
if (!isPspId(psp)) {
  throw new Error(`PIX_PSP must be one of the confirmed presets (efi, inter), got ${psp}`);
}
const environment = parsePspEnvironment(process.env["PIX_ENV"] ?? "sandbox");
const passphrase = process.env["PIX_CERT_PASSPHRASE"];

const client = new PixClient({
  ...presetClientOptions(psp, environment, {
    clientId: required("PIX_CLIENT_ID"),
    clientSecret: required("PIX_CLIENT_SECRET"),
  }),
  certificate: {
    pfx: readFileSync(required("PIX_CERT_PFX")),
    ...(passphrase === undefined ? {} : { passphrase }),
  },
  timeoutMs: 15_000,
});

try {
  // A generated txid makes PUT /cob/{txid} safely idempotent on retry.
  const txid = generateTxid();
  const cob = await client.cob.createWithTxid(txid, {
    calendario: { expiracao: 3600 },
    valor: { original: fromReais(37) },
    chave: required("PIX_KEY"),
    solicitacaoPagador: "Pedido de exemplo",
  });

  const location = cob.loc?.location;
  if (location === undefined) throw new Error("PSP did not return a payload location");

  const brCode = generateBrCode(location, {
    merchantName: process.env["MERCHANT_NAME"] ?? "Minha Loja",
    merchantCity: process.env["MERCHANT_CITY"] ?? "Sao Paulo",
    transactionId: txid,
  });
  console.log(`txid:   ${txid}`);
  console.log(`loc:    ${location}`);
  console.log(`BR Code: ${brCode}`);
} finally {
  await client.close();
}
