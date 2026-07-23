import { afterEach, describe, expect, it } from "vitest";
import { createActor, waitFor } from "xstate";
import { DEMO_PASSWORD } from "../../mocks/fixtures/credentials";
import { authMachine } from "./machine";
import { clearRefreshToken, loadRefreshToken } from "./token-storage";

afterEach(() => {
  clearRefreshToken();
});

describe("authMachine", () => {
  it("goes to unauthenticated when there is no stored session", async () => {
    const actor = createActor(authMachine).start();
    await waitFor(actor, (state) => state.matches("unauthenticated"));
    expect(actor.getSnapshot().context.user).toBeNull();
    actor.stop();
  });

  it("authenticates on valid credentials and persists the refresh token", async () => {
    const actor = createActor(authMachine).start();
    await waitFor(actor, (state) => state.matches("unauthenticated"));

    actor.send({ type: "SUBMIT_LOGIN", email: "ada@forge.dev", password: DEMO_PASSWORD });
    await waitFor(actor, (state) => state.matches("authenticated"));

    const snapshot = actor.getSnapshot();
    expect(snapshot.context.user?.email).toBe("ada@forge.dev");
    expect(snapshot.context.role?.name).toBe("ADMIN");
    expect(loadRefreshToken()).toBe(snapshot.context.refreshToken);
    actor.stop();
  });

  it("surfaces an error and stays unauthenticated on invalid credentials", async () => {
    const actor = createActor(authMachine).start();
    await waitFor(actor, (state) => state.matches("unauthenticated"));

    actor.send({ type: "SUBMIT_LOGIN", email: "ada@forge.dev", password: "wrong" });
    await waitFor(actor, (state) => state.context.error !== null);

    expect(actor.getSnapshot().matches("unauthenticated")).toBe(true);
    expect(actor.getSnapshot().context.error).toMatch(/invalid/i);
    actor.stop();
  });

  it("clears the session and returns to unauthenticated on logout", async () => {
    const actor = createActor(authMachine).start();
    await waitFor(actor, (state) => state.matches("unauthenticated"));

    actor.send({ type: "SUBMIT_LOGIN", email: "grace@forge.dev", password: DEMO_PASSWORD });
    await waitFor(actor, (state) => state.matches("authenticated"));

    actor.send({ type: "LOGOUT" });
    await waitFor(actor, (state) => state.matches("unauthenticated"));

    expect(actor.getSnapshot().context.user).toBeNull();
    expect(loadRefreshToken()).toBeNull();
    actor.stop();
  });

  it("restores a session from a previously stored refresh token", async () => {
    const first = createActor(authMachine).start();
    await waitFor(first, (state) => state.matches("unauthenticated"));
    first.send({ type: "SUBMIT_LOGIN", email: "alan@forge.dev", password: DEMO_PASSWORD });
    await waitFor(first, (state) => state.matches("authenticated"));
    first.stop();

    const second = createActor(authMachine).start();
    await waitFor(second, (state) => state.matches("authenticated"));
    expect(second.getSnapshot().context.user?.email).toBe("alan@forge.dev");
    second.stop();
  });
});
