import type { PermissionMap, Role } from "@forge/types";

const ALL_PERMISSIONS: PermissionMap = {
  "project:read": true,
  "project:write": true,
  "task:read": true,
  "task:write": true,
  "employee:read": true,
  "employee:write": true,
  "admin:access": true,
};

const MANAGER_PERMISSIONS: PermissionMap = {
  "project:read": true,
  "project:write": true,
  "task:read": true,
  "task:write": true,
  "employee:read": true,
  "employee:write": false,
  "admin:access": false,
};

const EMPLOYEE_PERMISSIONS: PermissionMap = {
  "project:read": true,
  "project:write": false,
  "task:read": true,
  "task:write": true,
  "employee:read": true,
  "employee:write": false,
  "admin:access": false,
};

export function createRoles(): [admin: Role, manager: Role, employee: Role] {
  return [
    { id: "role-admin", name: "ADMIN", permissions: ALL_PERMISSIONS },
    { id: "role-manager", name: "MANAGER", permissions: MANAGER_PERMISSIONS },
    { id: "role-employee", name: "EMPLOYEE", permissions: EMPLOYEE_PERMISSIONS },
  ];
}
