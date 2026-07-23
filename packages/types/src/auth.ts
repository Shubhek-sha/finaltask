import { z } from "zod";
import { userSchema } from "./user";

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const refreshRequestSchema = z.object({
  refreshToken: z.string(),
});
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

export const loginResponseSchema = z.object({
  user: userSchema,
  tokens: authTokensSchema,
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

/**
 * Shape of the decoded JWT-shaped token payloads. Signing/verification
 * (which needs the mock secret) lives server-side, in
 * apps/web/src/mocks/auth/jwt.ts — never imported by real app code.
 * Client code only ever decodes (packages/sdk's decodeToken), never verifies.
 */
export interface AccessTokenPayload {
  sub: string;
  email: string;
  roleId: string;
  organizationId: string;
  type: "access";
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string;
  type: "refresh";
  iat: number;
  exp: number;
}
