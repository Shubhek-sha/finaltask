import { AuthMachineContext } from "./AuthProvider";

export function useAuth() {
  const state = AuthMachineContext.useSelector((s) => s);
  const actorRef = AuthMachineContext.useActorRef();

  return {
    status: state.value as
      | "checkingSession"
      | "unauthenticated"
      | "authenticating"
      | "authenticated"
      | "refreshing",
    isCheckingSession: state.matches("checkingSession"),
    isAuthenticated: state.matches("authenticated") || state.matches("refreshing"),
    user: state.context.user,
    role: state.context.role,
    error: state.context.error,
    login: (email: string, password: string) => actorRef.send({ type: "SUBMIT_LOGIN", email, password }),
    logout: () => actorRef.send({ type: "LOGOUT" }),
  };
}
