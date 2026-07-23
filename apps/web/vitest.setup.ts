import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./src/mocks/server";
import { seedDatabase } from "./src/mocks/fixtures/seed";

beforeAll(() => {
  seedDatabase();
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  seedDatabase();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
