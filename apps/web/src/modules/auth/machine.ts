import { assign, fromPromise, setup } from "xstate";
import type { LoginResponse, Role, User } from "@forge/types";
import { authApi, decodeToken } from "@forge/sdk";
import { clearRefreshToken, loadRefreshToken, saveRefreshToken } from "./token-storage";

export interface AuthContext {
  user: User | null;
  role: Role | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
}

type AuthEvent = { type: "SUBMIT_LOGIN"; email: string; password: string } | { type: "LOGOUT" };

const initialContext: AuthContext = {
  user: null,
  role: null,
  accessToken: null,
  refreshToken: null,
  error: null,
};

function applyLogin(context: AuthContext, response: LoginResponse & { role?: Role }): AuthContext {
  return {
    ...context,
    user: response.user,
    role: response.role ?? context.role,
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    error: null,
  };
}

// Refresh 30s before the access token actually expires, so a request made
// right at the boundary doesn't race an expired token.
const REFRESH_SAFETY_MARGIN_MS = 30_000;
const FALLBACK_REFRESH_DELAY_MS = 10_000;

export const authMachine = setup({
  types: {} as {
    context: AuthContext;
    events: AuthEvent;
  },
  actors: {
    checkSession: fromPromise(async () => {
      const refreshToken = loadRefreshToken();
      if (!refreshToken) throw new Error("No stored session");
      const login = await authApi.refresh(refreshToken);
      const me = await authApi.me(login.tokens.accessToken);
      return { ...login, role: me.role };
    }),
    login: fromPromise(async ({ input }: { input: { email: string; password: string } }) => {
      const login = await authApi.login(input);
      const me = await authApi.me(login.tokens.accessToken);
      return { ...login, role: me.role };
    }),
    refreshSession: fromPromise(async ({ input }: { input: { refreshToken: string } }) => {
      const login = await authApi.refresh(input.refreshToken);
      const me = await authApi.me(login.tokens.accessToken);
      return { ...login, role: me.role };
    }),
  },
  actions: {
    persistSession: (_, params: { refreshToken: string }) => saveRefreshToken(params.refreshToken),
    clearSession: () => clearRefreshToken(),
  },
  delays: {
    ACCESS_TOKEN_TTL: ({ context }) => {
      if (!context.accessToken) return FALLBACK_REFRESH_DELAY_MS;
      const payload = decodeToken<{ exp?: number }>(context.accessToken);
      if (!payload?.exp) return FALLBACK_REFRESH_DELAY_MS;
      const msRemaining = payload.exp * 1000 - Date.now() - REFRESH_SAFETY_MARGIN_MS;
      return Math.max(msRemaining, 0);
    },
  },
}).createMachine({
  id: "auth",
  initial: "checkingSession",
  context: initialContext,
  states: {
    checkingSession: {
      invoke: {
        src: "checkSession",
        onDone: {
          target: "authenticated",
          actions: [
            assign(({ context, event }) => applyLogin(context, event.output)),
            { type: "persistSession", params: ({ event }) => ({ refreshToken: event.output.tokens.refreshToken }) },
          ],
        },
        onError: "unauthenticated",
      },
    },
    unauthenticated: {
      on: { SUBMIT_LOGIN: "authenticating" },
    },
    authenticating: {
      invoke: {
        src: "login",
        input: ({ event }) => {
          if (event.type !== "SUBMIT_LOGIN") throw new Error("unreachable");
          return { email: event.email, password: event.password };
        },
        onDone: {
          target: "authenticated",
          actions: [
            assign(({ context, event }) => applyLogin(context, event.output)),
            { type: "persistSession", params: ({ event }) => ({ refreshToken: event.output.tokens.refreshToken }) },
          ],
        },
        onError: {
          target: "unauthenticated",
          actions: assign(() => ({ ...initialContext, error: "Invalid email or password" })),
        },
      },
    },
    authenticated: {
      after: { ACCESS_TOKEN_TTL: "refreshing" },
      on: {
        LOGOUT: { target: "unauthenticated", actions: [assign(() => initialContext), "clearSession"] },
      },
    },
    refreshing: {
      invoke: {
        src: "refreshSession",
        input: ({ context }) => ({ refreshToken: context.refreshToken! }),
        onDone: {
          target: "authenticated",
          actions: [
            assign(({ context, event }) => applyLogin(context, event.output)),
            { type: "persistSession", params: ({ event }) => ({ refreshToken: event.output.tokens.refreshToken }) },
          ],
        },
        onError: {
          target: "unauthenticated",
          actions: [assign(() => initialContext), "clearSession"],
        },
      },
      on: {
        LOGOUT: { target: "unauthenticated", actions: [assign(() => initialContext), "clearSession"] },
      },
    },
  },
});
