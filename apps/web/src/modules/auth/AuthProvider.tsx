import type { ReactNode } from "react";
import { createActorContext } from "@xstate/react";
import { authMachine } from "./machine";

export const AuthMachineContext = createActorContext(authMachine);

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthMachineContext.Provider>{children}</AuthMachineContext.Provider>;
}
