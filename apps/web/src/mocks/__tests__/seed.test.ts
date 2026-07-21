import { describe, expect, it } from "vitest";
import { db } from "../db";
import { seedDatabase } from "../fixtures/seed";

describe("seedDatabase", () => {
  it("seeds one organization, three roles, and 15 users", () => {
    seedDatabase();
    expect(db.organizations.list()).toHaveLength(1);
    expect(db.roles.list().map((r) => r.name).sort()).toEqual(["ADMIN", "EMPLOYEE", "MANAGER"]);
    expect(db.users.list()).toHaveLength(15);
  });

  it("is deterministic across repeated seeds", () => {
    seedDatabase();
    const first = db.users.list().map((u) => u.id);
    seedDatabase();
    const second = db.users.list().map((u) => u.id);
    expect(second).toEqual(first);
  });

  it("scopes every seeded user to the seeded organization and a real role", () => {
    seedDatabase();
    const [organization] = db.organizations.list();
    const roleIds = new Set(db.roles.list().map((r) => r.id));

    for (const user of db.users.list()) {
      expect(user.organizationId).toBe(organization!.id);
      expect(roleIds.has(user.roleId)).toBe(true);
    }
  });
});
