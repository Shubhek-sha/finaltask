import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./src/mocks/server";
import { seedDatabase } from "./src/mocks/fixtures/seed";

beforeAll(() => {
  seedDatabase();
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  seedDatabase();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
