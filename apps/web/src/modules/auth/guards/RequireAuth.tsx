import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../useAuth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isCheckingSession, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isCheckingSession) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
