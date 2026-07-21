import { faker } from "@faker-js/faker";
import type { User } from "@forge/types";

export function createUser(overrides: Partial<User> & Pick<User, "organizationId" | "roleId">): User {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    avatarUrl: undefined,
    ...overrides,
  };
}
