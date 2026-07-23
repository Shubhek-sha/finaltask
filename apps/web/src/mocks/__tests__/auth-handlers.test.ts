import { describe, expect, it } from "vitest";
import { db } from "../db";
import { DEMO_PASSWORD } from "../fixtures/credentials";

async function login(email: string, password: string) {
  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return { status: res.status, body: await res.json() };
}

describe("auth handlers", () => {
  it("logs in a seeded user with the correct password", async () => {
    const { status, body } = await login("ada@forge.dev", DEMO_PASSWORD);
    expect(status).toBe(200);
    expect(body.user.email).toBe("ada@forge.dev");
    expect(typeof body.tokens.accessToken).toBe("string");
    expect(body.tokens.accessToken.split(".")).toHaveLength(3);
    expect(typeof body.tokens.refreshToken).toBe("string");
  });

  it("rejects an incorrect password", async () => {
    const { status, body } = await login("ada@forge.dev", "wrong-password");
    expect(status).toBe(401);
    expect(body.message).toMatch(/invalid/i);
  });

  it("rejects an unknown email", async () => {
    const { status } = await login("nobody@forge.dev", DEMO_PASSWORD);
    expect(status).toBe(401);
  });

  it("refreshes an access token given a valid refresh token", async () => {
    const loginResult = await login("grace@forge.dev", DEMO_PASSWORD);
    const res = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: loginResult.body.tokens.refreshToken }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.email).toBe("grace@forge.dev");
    expect(typeof body.tokens.accessToken).toBe("string");
  });

  it("rejects a refresh with a garbage token", async () => {
    const res = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: "not-a-real-token" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns the current user + role for a valid access token", async () => {
    const loginResult = await login("alan@forge.dev", DEMO_PASSWORD);
    const res = await fetch("/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${loginResult.body.tokens.accessToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.email).toBe("alan@forge.dev");
    expect(body.role.name).toBe("EMPLOYEE");
  });

  it("rejects /auth/me with no token", async () => {
    const res = await fetch("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });

  it("rejects /auth/me with a refresh token used as an access token", async () => {
    const loginResult = await login("ada@forge.dev", DEMO_PASSWORD);
    const res = await fetch("/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${loginResult.body.tokens.refreshToken}` },
    });
    expect(res.status).toBe(401);
  });

  it("issues an admin token whose payload matches the seeded admin role", async () => {
    const { body } = await login("ada@forge.dev", DEMO_PASSWORD);
    const [, payloadPart] = body.tokens.accessToken.split(".");
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")));
    const adminRole = db.roles.find((r) => r.name === "ADMIN");
    expect(payload.roleId).toBe(adminRole?.id);
  });
});
