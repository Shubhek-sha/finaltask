import type { ReactNode } from "react";
import type { PermissionKey, PermissionMap } from "@forge/types";

export interface CanProps {
  /** The current user's permission map (e.g. role.permissions) — this
   * component never reaches into app-level auth state itself, so it stays
   * usable from any module without creating a dependency on one. */
  permissions: PermissionMap | undefined;
  I: PermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ permissions, I, children, fallback = null }: CanProps) {
  return permissions?.[I] ? <>{children}</> : <>{fallback}</>;
}
