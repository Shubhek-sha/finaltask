import type { LoginRequest, LoginResponse, Role, User } from "@forge/types";
import { apiRequest } from "./http";

export const authApi = {
  login: (input: LoginRequest) =>
    apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  refresh: (refreshToken: string) =>
    apiRequest<LoginResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  logout: () => apiRequest<void>("/auth/logout", { method: "POST" }),

  me: (accessToken: string) =>
    apiRequest<{ user: User; role: Role }>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};
