const REFRESH_TOKEN_KEY = "forge.refreshToken";

/**
 * Only the refresh token is persisted (localStorage) so a reload can
 * silently re-establish a session. The access token lives only in the
 * XState machine's in-memory context — see ARCHITECTURE.md §7.
 */
export function loadRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
