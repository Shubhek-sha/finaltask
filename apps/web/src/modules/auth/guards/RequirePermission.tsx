import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { PermissionKey } from "@forge/types";
import { useAuth } from "../useAuth";

export function RequirePermission({
  permission,
  children,
}: {
  permission: PermissionKey;
  children: ReactNode;
}) {
  const { role } = useAuth();

  if (!role?.permissions[permission]) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
