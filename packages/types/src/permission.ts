import { z } from "zod";

export const PERMISSIONS = [
  "project:read",
  "project:write",
  "task:read",
  "task:write",
  "employee:read",
  "employee:write",
  "admin:access",
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number];

const permissionShape = Object.fromEntries(
  PERMISSIONS.map((key) => [key, z.boolean()]),
) as Record<PermissionKey, z.ZodBoolean>;

export const permissionMapSchema = z.object(permissionShape).partial();

export type PermissionMap = z.infer<typeof permissionMapSchema>;
