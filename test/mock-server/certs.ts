/**
 * Locally generated CA/server/client certificates for mTLS tests. Everything
 * is produced in-process with `node-forge` — no external CA, no network, no
 * committed key material.
 */

import * as forge from "node-forge";

export interface TestCertificates {
  readonly caCertPem: string;
  readonly caKeyPem: string;
  readonly serverCertPem: string;
  readonly serverKeyPem: string;
  readonly clientCertPem: string;
  readonly clientKeyPem: string;
  readonly clientPfx: Buffer;
  readonly pfxPassphrase: string;
}

let cached: TestCertificates | undefined;

/** Returns the cached test PKI (RSA key generation is expensive). */
export function testCertificates(): TestCertificates {
  cached ??= generateTestCertificates();
  return cached;
}

/** Generates a fresh, self-contained test PKI. */
export function generateTestCertificates(): TestCertificates {
  const caKeys = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
  const serverKeys = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
  const clientKeys = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });

  const caAttrs: forge.pki.CertificateField[] = [
    { name: "commonName", value: "Pix SDK BR Test CA" },
  ];
  const caCert = forge.pki.createCertificate();
  caCert.publicKey = caKeys.publicKey;
  caCert.serialNumber = "01";
  setValidity(caCert);
  caCert.setSubject(caAttrs);
  caCert.setIssuer(caAttrs);
  caCert.setExtensions([
    { name: "basicConstraints", cA: true, critical: true },
    { name: "keyUsage", keyCertSign: true, cRLSign: true, digitalSignature: true, critical: true },
  ]);
  caCert.sign(caKeys.privateKey, forge.md.sha256.create());

  const serverCert = issue(
    serverKeys,
    caCert,
    caKeys.privateKey,
    [{ name: "commonName", value: "localhost" }],
    "02",
    [
      { name: "basicConstraints", cA: false, critical: true },
      { name: "keyUsage", digitalSignature: true, keyEncipherment: true, critical: true },
      { name: "extKeyUsage", serverAuth: true },
      {
        name: "subjectAltName",
        altNames: [
          { type: 2, value: "localhost" },
          { type: 7, ip: "127.0.0.1" },
        ],
      },
    ],
  );

  const clientCert = issue(
    clientKeys,
    caCert,
    caKeys.privateKey,
    [{ name: "commonName", value: "pix-sdk-br test client" }],
    "03",
    [
      { name: "basicConstraints", cA: false, critical: true },
      { name: "keyUsage", digitalSignature: true, critical: true },
      { name: "extKeyUsage", clientAuth: true },
    ],
  );

  const pfxPassphrase = "pix-sdk-br-test-passphrase";
  const pfxAsn1 = forge.pkcs12.toPkcs12Asn1(
    clientKeys.privateKey,
    [clientCert, caCert],
    pfxPassphrase,
    { algorithm: "3des", useMac: true },
  );

  return {
    caCertPem: forge.pki.certificateToPem(caCert),
    caKeyPem: forge.pki.privateKeyToPem(caKeys.privateKey),
    serverCertPem: forge.pki.certificateToPem(serverCert),
    serverKeyPem: forge.pki.privateKeyToPem(serverKeys.privateKey),
    clientCertPem: forge.pki.certificateToPem(clientCert),
    clientKeyPem: forge.pki.privateKeyToPem(clientKeys.privateKey),
    clientPfx: Buffer.from(forge.asn1.toDer(pfxAsn1).getBytes(), "binary"),
    pfxPassphrase,
  };
}

function issue(
  keys: forge.pki.rsa.KeyPair,
  issuer: forge.pki.Certificate,
  issuerKey: forge.pki.rsa.PrivateKey,
  subject: forge.pki.CertificateField[],
  serial: string,
  extensions: object[],
): forge.pki.Certificate {
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = serial;
  setValidity(cert);
  cert.setSubject(subject);
  cert.setIssuer(issuer.subject.attributes);
  cert.setExtensions(extensions);
  cert.sign(issuerKey, forge.md.sha256.create());
  return cert;
}

function setValidity(cert: forge.pki.Certificate): void {
  cert.validity.notBefore = new Date(Date.now() - 24 * 60 * 60 * 1000);
  cert.validity.notAfter = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
}
