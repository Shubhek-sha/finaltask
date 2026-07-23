/**
 * Decodes a JWT-shaped token's payload WITHOUT verifying its signature —
 * client code never has the mock secret (see packages/types/src/auth.ts).
 * Only safe to use for reading non-trusted-but-not-sensitive claims like
 * `exp`, since the server (the MSW handler) re-verifies on every request.
 */
export function decodeToken<T>(token: string): T | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const padded = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(payloadPart.length + ((4 - (payloadPart.length % 4)) % 4), "=");

    return JSON.parse(atob(padded)) as T;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken<{ exp?: number }>(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now();
}
