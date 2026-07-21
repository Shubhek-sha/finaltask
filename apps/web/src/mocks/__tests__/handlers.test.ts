import { describe, expect, it } from "vitest";
import { db } from "../db";

describe("mock API handlers", () => {
  it("GET /api/v1/health returns ok", async () => {
    const res = await fetch("/api/v1/health");
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ status: "ok" });
  });

  it("GET /api/v1/organizations/current returns the seeded organization", async () => {
    const res = await fetch("/api/v1/organizations/current");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(db.organizations.list()[0]);
  });
});
