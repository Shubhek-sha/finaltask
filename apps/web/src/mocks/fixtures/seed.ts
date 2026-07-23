import { faker } from "@faker-js/faker";
import { db } from "../db";
import { credentials, DEMO_PASSWORD, setCredential } from "./credentials";
import { createOrganization } from "./organization";
import { createRoles } from "./role";
import { createUser } from "./user";

const DEMO_USERS = [
  { name: "Ada Lovelace", email: "ada@forge.dev", role: "ADMIN" as const },
  { name: "Grace Hopper", email: "grace@forge.dev", role: "MANAGER" as const },
  { name: "Alan Turing", email: "alan@forge.dev", role: "EMPLOYEE" as const },
];

const RANDOM_EMPLOYEE_COUNT = 12;

/**
 * Resets and repopulates the in-memory mock store with deterministic demo
 * data (fixed faker seed) — called once before the MSW worker/server
 * starts. See ARCHITECTURE.md §3 for why this isn't mirrored to
 * localStorage: a clean, reproducible seed on every load beats a stale one.
 */
export function seedDatabase() {
  faker.seed(42);

  db.organizations.clear();
  db.roles.clear();
  db.users.clear();
  credentials.clear();

  const organization = db.organizations.create(createOrganization());

  const [adminRole, managerRole, employeeRole] = createRoles();
  db.roles.create(adminRole);
  db.roles.create(managerRole);
  db.roles.create(employeeRole);

  const roleByName = {
    ADMIN: adminRole,
    MANAGER: managerRole,
    EMPLOYEE: employeeRole,
  };

  for (const demo of DEMO_USERS) {
    const user = db.users.create(
      createUser({
        organizationId: organization.id,
        roleId: roleByName[demo.role].id,
        name: demo.name,
        email: demo.email,
      }),
    );
    setCredential(user.email, DEMO_PASSWORD);
  }

  for (let i = 0; i < RANDOM_EMPLOYEE_COUNT; i++) {
    const user = db.users.create(
      createUser({ organizationId: organization.id, roleId: employeeRole.id }),
    );
    setCredential(user.email, DEMO_PASSWORD);
  }

  return {
    organization,
    roles: db.roles.list(),
    users: db.users.list(),
  };
}
