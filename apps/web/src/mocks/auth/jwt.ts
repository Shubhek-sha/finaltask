/**
 * Issues and verifies JWT-shaped tokens (real base64url header.payload.signature,
 * HMAC-SHA256-signed) for the mock auth handlers. This is the one file in
 * the mock layer that holds the "server" secret — never imported by real
 * app code (packages/sdk only ever decodes, via its own token.ts, without
 * verifying). See ARCHITECTURE.md §3 and §7.
 */

const MOCK_SIGNING_SECRET = "forge-mock-dev-secret-not-for-production";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(input: string): Uint8Array<ArrayBuffer> {
  const padded = input
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function getSigningKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(MOCK_SIGNING_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signToken<T extends object>(payload: T): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const signingInput = `${base64url(encoder.encode(JSON.stringify(header)))}.${base64url(
    encoder.encode(JSON.stringify(payload)),
  )}`;

  const key = await getSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signingInput));

  return `${signingInput}.${base64url(new Uint8Array(signature))}`;
}

export async function verifyToken<T extends { exp?: number }>(token: string): Promise<T | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerPart, payloadPart, signaturePart] = parts as [string, string, string];

  const key = await getSigningKey();
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64urlDecode(signaturePart),
    encoder.encode(`${headerPart}.${payloadPart}`),
  );
  if (!isValid) return null;

  const payload = JSON.parse(decoder.decode(base64urlDecode(payloadPart))) as T;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;

  return payload;
}
