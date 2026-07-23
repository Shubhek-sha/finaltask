/**
 * Login credentials for seeded users, kept separate from the `User` type
 * (packages/types) the same way a real backend would never return a
 * password hash on the user resource itself.
 */
export const DEMO_PASSWORD = "password123";

export const credentials = new Map<string, string>();

export function setCredential(email: string, password: string): void {
  credentials.set(email.toLowerCase(), password);
}

export function checkCredential(email: string, password: string): boolean {
  return credentials.get(email.toLowerCase()) === password;
}
