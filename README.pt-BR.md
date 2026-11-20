# pix-sdk-br

SDK TypeScript, agnóstico de PSP e totalmente tipado para a **API padrão Pix publicada pelo Banco
Central do Brasil** (a OpenAPI oficial "API Pix" `2.11.0-rc1`, repositório
[`bacen/pix-api`](https://github.com/bacen/pix-api)).

Todo PSP brasileiro que implementa a API Pix padrão — Efí, Inter, Sicoob, Banco do Brasil, Itaú,
Santander, Sicredi, … — expõe o mesmo contrato, diferindo apenas em URL base, detalhes de OAuth e
mTLS. Este projeto é **um SDK para todos eles**, gerado diretamente da especificação oficial.

> **Status (milestone 5 concluído):** pipeline de spec fixada, geração de código completa, cliente
> principal, parsing/adapters de webhook, verificação de JWS, geração de BR Code e **presets de PSP
> com evidência documental** estão prontos. Os exemplos em `examples/` são checados por tipo no CI.

---

## Instalação

É necessário **Node.js 20 ou superior**. Este pacote **não é publicado** no npm; instale pelo
repositório ou por um clone local:

```bash
npm install github:hadagalberto-junior/pix-sdk-br
# ou, a partir de um clone deste repositório:
npm install ../pix-sdk-br
```

O SDK é ESM + CJS e inclui declarações de tipo:

```ts
import { PixClient, generateBrCode } from "pix-sdk-br";
const { PixClient } = require("pix-sdk-br");
```

`express` e `fastify` são **peers opcionais** — instale apenas se usar o adapter de webhook
correspondente (`npm i express` ou `npm i fastify`). A única dependência de runtime é `undici`.

---

## O que já existe

| Parte               | Localização                                 | O que é                                                                                                                                                                                                                                               |
| ------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec fixada         | `spec/spec.lock.json`, `npm run spec:fetch` | Baixa a spec em commit fixo e verifica o SHA-256. O YAML não é commitado (o upstream não tem licença); o código gerado a partir dele é.                                                                                                               |
| Gerador de código   | `scripts/generate.ts` (`npm run generate`)  | Gera tipos para **todos** os schemas, tipos de request/response por operação, validadores em runtime, o registro `OPERATIONS` e os exemplos oficiais. A saída fica em `src/generated/` e um teste detecta divergências.                               |
| Cliente principal   | `src/client/`                               | `PixClient` com namespaces tipados (`cob`, `cobv`, `lotecobv`, `loc`, `locrec`, `pix.devolucao`, `webhook*`, `rec`, `solicrec`, `cobr`, `payload`), mTLS via undici, cache OAuth2 com single-flight, retries idempotentes, timeouts e erros RFC 7807. |
| Webhooks            | `src/webhooks/`, `pix-sdk-br/webhooks/*`    | `parseWebhook(body)` com resultados discriminados e validados para `pix`, `rec`, `cobr`, `cob` e `cobv`; adapters Node `http`, Express e Fastify com tratamento configurável do sufixo de path.                                                       |
| Payload assinado/QR | `src/payload/`                              | `client.payload.fetchVerified(location)` verifica JWS RS256/ES256/PS256 (cadeia, validade e hostname) antes de validar o payload; `generateBrCode` gera o "copia e cola" com CRC16/CCITT-FALSE.                                                       |
| Presets de PSP      | `src/presets.ts`                            | Presets apenas para PSPs cujas URLs de produção e sandbox e URL de token foram confirmadas em documentação oficial pública (URLs e data de verificação no código). Atualmente Efí e Inter.                                                            |
| Exemplos            | `examples/`                                 | Exemplo de criar cob + BR Code e receptor de webhook com Fastify, checados por tipo no CI (`npm run typecheck:examples`).                                                                                                                             |
| Testes              | `test/`                                     | 665+ testes: unidades, provas de cobertura spec↔código, testes de contrato com ajv, vetores válidos/inválidos, presets, integração mTLS/OAuth com mock local. Cobertura ≥ 90% de linhas.                                                              |

---

## Início rápido

### Validando antes de enviar

```ts
import { validateCobSolicitada, type CobSolicitada } from "pix-sdk-br";

const body: CobSolicitada = {
  calendario: { expiracao: 3600 },
  devedor: { cpf: "12345678909", nome: "Francisco da Silva" },
  valor: { original: "37.00" },
  chave: "5f84a4c5-c5cb-4599-9f13-7eb4d419dacc",
};
const result = validateCobSolicitada(body);
if (!result.ok) {
  for (const issue of result.issues) console.error(`${issue.path}: ${issue.message}`);
}
```

Todos os validadores são totais: dados malformados produzem `{ ok: false, issues: [...] }` com
caminhos precisos, nunca exceções.

### Usando o cliente

```ts
import { PixClient, PixApiError, PixValidationError, generateTxid } from "pix-sdk-br";
import { readFileSync } from "node:fs";

const client = new PixClient({
  baseUrl: "https://pix.psp.example.com",
  clientId: process.env.PIX_CLIENT_ID!,
  clientSecret: process.env.PIX_CLIENT_SECRET!,
  certificate: {
    pfx: readFileSync("certificate.pfx"),
    passphrase: process.env.PIX_CERT_PASSPHRASE!,
  },
  scopes: ["cob.read", "cob.write"],
  timeoutMs: 15_000,
  retry: { maxAttempts: 3 }, // somente chamadas idempotentes
});

try {
  const txid = generateTxid();
  const cob = await client.cob.createWithTxid(txid, {
    calendario: { expiracao: 3600 },
    valor: { original: "37.00" },
    chave: "5f84a4c5-c5cb-4599-9f13-7eb4d419dacc",
  });
  console.log(cob.loc?.location);
} catch (error) {
  if (error instanceof PixValidationError) console.error(error.fieldPaths);
  else if (error instanceof PixApiError) console.error(error.status, error.violations);
  throw error;
} finally {
  await client.close();
}
```

`certificate` também aceita `{ cert, key, ca? }` em PEM. Passe `fetch` (e opcionalmente um
`dispatcher` undici) para ambientes como Bun/Deno. Todo método aceita `{ signal, timeoutMs }`.

### Presets de PSP

Um preset só existe quando a documentação **oficial e pública** do PSP informa as três coisas:
URL base de produção, URL base de sandbox e URL de token (nos dois ambientes). Cada entrada em
`src/presets.ts` traz a URL da fonte e a data da verificação — nenhuma URL é inferida de outro SDK
ou fórum.

| PSP   | Ambiente | URL base                                           | URL do token                                               | Fonte oficial                                                                                                                                                                                | Verificado em |
| ----- | -------- | -------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Efí   | sandbox  | `https://pix-h.api.efipay.com.br`                  | `https://pix-h.api.efipay.com.br/oauth/token`              | [Credenciais, Certificado e Autorização](https://dev.efipay.com.br/docs/api-pix/credenciais/) — "Rotas base" + `POST /oauth/token`                                                           | 2026-11-20    |
| Efí   | produção | `https://pix.api.efipay.com.br`                    | `https://pix.api.efipay.com.br/oauth/token`                | [Credenciais, Certificado e Autorização](https://dev.efipay.com.br/docs/api-pix/credenciais/) — "Rotas base" + `POST /oauth/token`                                                           | 2026-11-20    |
| Inter | sandbox  | `https://cdpj-sandbox.partners.uatinter.co/pix/v2` | `https://cdpj-sandbox.partners.uatinter.co/oauth/v2/token` | [OpenAPI Pix](https://developers.inter.co/redocusaurus/swagger-api-pix-automatico-yaml.yaml) + [OpenAPI OAuth](https://developers.inter.co/redocusaurus/swagger-token-yaml.yaml) (`servers`) | 2026-11-20    |
| Inter | produção | `https://cdpj.partners.bancointer.com.br/pix/v2`   | `https://cdpj.partners.bancointer.com.br/oauth/v2/token`   | [OpenAPI Pix](https://developers.inter.co/redocusaurus/swagger-api-pix-automatico-yaml.yaml) + [OpenAPI OAuth](https://developers.inter.co/redocusaurus/swagger-token-yaml.yaml) (`servers`) | 2026-11-20    |

```ts
import { PixClient, isPspId, parsePspEnvironment, presetClientOptions } from "pix-sdk-br";

const psp = process.env["PIX_PSP"] ?? "efi";
if (!isPspId(psp)) throw new Error(`PSP não suportado: ${psp}`);
const ambiente = parsePspEnvironment(process.env["PIX_ENV"] ?? "sandbox");

const client = new PixClient({
  ...presetClientOptions(psp, ambiente, {
    clientId: process.env["PIX_CLIENT_ID"]!,
    clientSecret: process.env["PIX_CLIENT_SECRET"]!,
  }),
  certificate: { pfx: readFileSync("certificado.p12"), passphrase: "" },
});
```

`presetClientOptions` preenche `baseUrl`, `oauth.tokenUrl` e (quando documentados) os escopos
padrão. Credenciais e certificados nunca fazem parte de um preset.

Os demais PSPs foram pesquisados, mas não podem virar preset sem inventar endpoints. Configure-os
manualmente com os valores do seu portal:

| PSP             | Portal oficial consultado                                                                  | Motivo                                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Sicoob          | [Portal Developers](https://developers.sicoob.com.br/portal/)                              | A documentação pública exige login para as URLs; o sandbox usa token estático do portal, não um endpoint OAuth documentado.                |
| Banco do Brasil | [API Pix](https://www.bb.com.br/site/developers/api-pix/)                                  | A página pública descreve o produto, mas não informa os hosts concretos de produção/homologação (guias exigem login).                      |
| Itaú            | [Autenticação mTLS](https://devportal.itau.com.br/autenticacao-documentacao)               | O guia público informa o host do STS, mas diz que a URL base de cada API está no catálogo com login; o sandbox não usa OAuth.              |
| Santander       | [Referência API Pix](https://developer.santander.com.br/api/documentacao/pix)              | A referência de Pix não é recuperável publicamente sem autenticação no portal.                                                             |
| Sicredi         | [Getting started — Pix](https://developers.sicredi.com.br/public/docs/getting-started-pix) | A produção é pública, mas os docs dizem explicitamente que as URLs de homologação são enviadas pela equipe Sicredi na liberação do acesso. |

```ts
// Configuração manual para um PSP sem preset.
const client = new PixClient({
  baseUrl: process.env["PIX_BASE_URL"]!,
  clientId: process.env["PIX_CLIENT_ID"]!,
  clientSecret: process.env["PIX_CLIENT_SECRET"]!,
  oauth: { tokenUrl: process.env["PIX_TOKEN_URL"]! },
  certificate: { cert: pemCert, key: pemKey, ca: pspCa },
});
```

### Webhooks

`parseWebhook` valida o payload contra os schemas gerados e retorna um resultado discriminado:

```ts
import { parseWebhook, parseWebhookOrThrow } from "pix-sdk-br";

const result = parseWebhook(requestBody);
if (!result.ok) {
  console.error(result.issues); // { code, path, message }[]
} else if (result.kind === "pix") {
  for (const pix of result.data.pix ?? []) console.log(pix.endToEndId);
}
```

Adapters vivem em subpath exports de peers opcionais:

```ts
// Node http/https:
createServer(
  createNodeWebhookHandler({
    path: { basePath: "/webhook", pathSuffix: "strip" },
    onWebhook: (event) => console.log(event.kind, event.data),
  }),
).listen(3000);

// Express: app.use(express.json()); app.post("/webhook", expressWebhook({ onWebhook }));
// Fastify: app.post("/webhook", fastifyWebhook({ onWebhook }));
```

**Sufixo de path.** Os callbacks BCB são registrados como `{webhookUrl}/pix`, então o PSP costuma
chamar `/webhook/pix`. `path.pathSuffix` controla isso: `"strip"` (padrão) remove o sufixo,
`"reject"` devolve 404/`next()` e `"ignore"` mantém a URL. Use `path.basePath` para restringir os
paths aceitos.

#### Webhooks com mTLS

Normalmente o PSP apresenta um certificado cliente e seu endpoint valida contra a CA do PSP. A
verificação é feita na camada de transporte — o SDK não altera o handshake nem o corpo:

```ts
import { createServer } from "node:https";
import { readFileSync } from "node:fs";
import { createNodeWebhookHandler } from "pix-sdk-br/webhooks/node";

createServer(
  {
    pfx: readFileSync("webhook.p12"),
    passphrase: process.env["WEBHOOK_CERT_PASSPHRASE"],
    ca: readFileSync("psp-ca.pem"),
    requestCert: true,
    rejectUnauthorized: true,
  },
  createNodeWebhookHandler({ onWebhook: (event) => console.log(event.kind) }),
).listen(443);
```

Detrás de nginx/Envoy/ALB, termine o mTLS no proxy e **rejeite** certificados ausentes ou inválidos
(repassar um header `X-Client-Cert` sem validar não é mTLS). Mantenha a CA do PSP atualizada. O
exemplo `examples/fastify-webhook.ts` faz o mesmo com a opção `https` do Fastify.

### Payload assinado e BR Code

```ts
import { generateBrCode } from "pix-sdk-br";

const location = (await client.cob.createWithTxid(txid, body)).loc?.location!;
const copiaECola = generateBrCode(location, {
  merchantName: "Minha Loja",
  merchantCity: "Sao Paulo",
  transactionId: txid,
});
console.log(copiaECola);

const verified = await client.payload.fetchVerified(location, { trustedCa: caPem });
console.log(verified.payloadKind, verified.payload);
```

`verifyJws(jws, options)` também é exportado. Rejeita assinaturas forjadas, algoritmos inválidos,
certificados não confiáveis/vencidos, hostname divergente e payloads malformados com `PixJwsError`.

---

## Tratamento de erros

Todo erro do SDK estende `PixError`:

| Classe               | Quando                                                      | Campos úteis                                                                                               |
| -------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `PixValidationError` | Body/parâmetro falha na validação local derivada da spec    | `operation`, `issues`, `fieldPaths`                                                                        |
| `PixApiError`        | Resposta não-2xx, interpretada como RFC 7807 `problem+json` | `status`, `type`, `title`, `detail`, `correlationId`, `violations`, `violationPaths`, `problem`, `context` |
| `PixAuthError`       | Falha ao obter/renovar token                                | `tokenUrl`, `status`, `cause`                                                                              |
| `PixNetworkError`    | Falha de conexão/TLS/DNS/timeout após os retries            | `code`, `timeout`, `context`, `cause`                                                                      |
| `PixAbortError`      | Chamada cancelada por `AbortSignal`                         | `cause`                                                                                                    |
| `PixWebhookError`    | `parseWebhookOrThrow` rejeitou o callback                   | `issues`                                                                                                   |
| `PixJwsError`        | Falha ao buscar/verificar o JWS                             | `code`                                                                                                     |

```ts
import { PixApiError, PixValidationError, PixError } from "pix-sdk-br";

try {
  await client.cob.createWithTxid(txid, body);
} catch (error) {
  if (error instanceof PixValidationError) {
    console.error(error.operation, error.fieldPaths, error.issues); // nada foi enviado
  } else if (error instanceof PixApiError) {
    console.error(error.status, error.detail, error.correlationId, error.violations);
  } else if (error instanceof PixError) {
    console.error(error.name, error.message);
  } else {
    throw error;
  }
}
```

Retries ocorrem automaticamente **apenas em chamadas idempotentes** (GET, PUT com txid, DELETE)
em 429/5xx/erros de rede, respeitando `Retry-After`, com backoff exponencial e jitter. Desative com
`retry: false`. O timeout padrão é 15 s (global `timeoutMs` ou por chamada).

---

## A spec, as erratas e os exemplos oficiais inválidos

A spec fixada contém constructos objetivamente quebrados (chaves `required` undeclared, regex com
barras, `oneOf` insatisfazível etc.). O gerador aplica uma **lista de erratas documentada**, com
asserts que falham alto se o upstream mudar, e a expõe em runtime como `SPEC_ERRATA`.

Alguns exemplos oficiais contradizem os próprios schemas (campos obrigatórios ausentes, valores
numéricos como string, `endToEndId` com 34 caracteres). Os validadores seguem o schema fielmente e a
suíte fixa cada exemplo como **fixture inválida documentada** — provando que as regras são
enforçadas, não enfraquecidas.

Nota: `pattern` é busca não ancorada e `format: uri` aceita URLs relativas — é o que a spec declara.

---

## Estrutura do projeto

```
spec/spec.lock.json        # spec fixada (URL + commit + sha256)
scripts/                   # fetch-spec + gerador
src/generated/             # saída do gerador (checada contra divergências)
src/validation/            # motor de validação escrito à mão
src/client/                # HTTP/OAuth/retry/erros/logger + PixClient
src/webhooks/              # parser discriminado + adapters
src/payload/               # verificação JWS + BR Code
src/presets.ts             # presets com evidência e configuração manual
examples/                  # exemplos checados por tipo no CI
test/mock-server/          # API Pix local com mTLS, OAuth e falhas injetáveis
test/                      # suíte vitest; cobertura ≥ 90% de linhas
```

## Desenvolvimento

Requisitos: Node.js ≥ 20 e npm.

```bash
npm install
npm run spec:fetch        # baixa a spec fixada (verifica checksum)
npm run generate          # regenera src/generated (falha alto em divergência)
npm test                  # roda a suíte
npm run test:coverage     # ...com limites de cobertura
npm run lint              # eslint rígido — política de zero warnings
npm run format            # prettier
npm run typecheck         # tsc --noEmit (src, scripts, testes e exemplos)
npm run typecheck:examples # exemplos isoladamente (também no CI)
npm run build             # tsup → dist/ (ESM + CJS + d.ts)
```

## FAQ

**Quais PSPs têm preset e por que não todos os sete?** Apenas Efí e Inter publicam as três URLs
necessárias em docs oficiais públicas. Os outros cinco estão listados com o portal oficial e o
motivo exato; use configuração manual. Preset nunca é criado a partir de fórum ou constantes de
outro SDK.

**Os testes chamam bancos reais?** Não. Rodam contra um mock HTTPS + mTLS local com certificados
gerados na própria suíte. A rede é usada apenas para buscar a spec fixada e a documentação dos PSPs.

**Por que valores monetários são strings like `"10.00"`?** É o que a spec do BCB exige. Use
`fromReais`/`fromCents`/`toCents` para converter por inteiros.

**O PSP chama `/webhook/pix` mesmo eu tendo registrado `/webhook`?** Não é bug: callbacks BCB são
registrados como `{webhookUrl}/pix`. Os adapters usam `path.pathSuffix: "strip"` por padrão.

**Preciso de mTLS para receber webhooks?** Em geral sim. Termine o mTLS no seu servidor/proxy e
valide o certificado do PSP contra a CA dele.

**Posso rodar em Bun/Deno?** A camada HTTP é pluggable via `fetch`. A verificação de JWS usa
`crypto` do Node e permanece voltada a Node.

**É publicado no npm?** Não. Instale pelo repositório ou por um build local. Licença: MIT —
Hadagalberto Junior.
