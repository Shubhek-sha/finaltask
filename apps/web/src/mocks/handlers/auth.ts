import { http, HttpResponse } from "msw";
import {
  loginRequestSchema,
  refreshRequestSchema,
  type AccessTokenPayload,
  type RefreshTokenPayload,
} from "@forge/types";
import { db } from "../db";
import { checkCredential } from "../fixtures/credentials";
import { signToken, verifyToken } from "../auth/jwt";

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

async function issueTokens(user: { id: string; email: string; roleId: string; organizationId: string }) {
  const now = Math.floor(Date.now() / 1000);

  const accessPayload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    roleId: user.roleId,
    organizationId: user.organizationId,
    type: "access",
    iat: now,
    exp: now + ACCESS_TOKEN_TTL_SECONDS,
  };
  const refreshPayload: RefreshTokenPayload = {
    sub: user.id,
    type: "refresh",
    iat: now,
    exp: now + REFRESH_TOKEN_TTL_SECONDS,
  };

  return {
    accessToken: await signToken(accessPayload),
    refreshToken: await signToken(refreshPayload),
  };
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  return header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
}

export const authHandlers = [
  http.post("/api/v1/auth/login", async ({ request }) => {
    const parsed = loginRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return HttpResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !checkCredential(email, password)) {
      return HttpResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const tokens = await issueTokens(user);
    return HttpResponse.json({ user, tokens });
  }),

  http.post("/api/v1/auth/refresh", async ({ request }) => {
    const parsed = refreshRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return HttpResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const payload = await verifyToken<RefreshTokenPayload>(parsed.data.refreshToken);
    if (!payload || payload.type !== "refresh") {
      return HttpResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 });
    }

    const user = db.users.get(payload.sub);
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 401 });
    }

    const tokens = await issueTokens(user);
    return HttpResponse.json({ user, tokens });
  }),

  http.post("/api/v1/auth/logout", () => new HttpResponse(null, { status: 204 })),

  http.get("/api/v1/auth/me", async ({ request }) => {
    const token = bearerToken(request);
    const payload = token ? await verifyToken<AccessTokenPayload>(token) : null;

    if (!payload || payload.type !== "access") {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = db.users.get(payload.sub);
    const role = user ? db.roles.get(user.roleId) : undefined;
    if (!user || !role) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return HttpResponse.json({ user, role });
  }),
];
