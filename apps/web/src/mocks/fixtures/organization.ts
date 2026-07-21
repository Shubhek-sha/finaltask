import { faker } from "@faker-js/faker";
import type { Organization } from "@forge/types";

export function createOrganization(overrides: Partial<Organization> = {}): Organization {
  return {
    id: faker.string.uuid(),
    name: "Forge Inc.",
    ...overrides,
  };
}
