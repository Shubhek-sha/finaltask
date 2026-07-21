import { z } from "zod";
import { permissionMapSchema } from "./permission";

export const ROLE_NAMES = ["ADMIN", "MANAGER", "EMPLOYEE"] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const roleSchema = z.object({
  id: z.string(),
  name: z.enum(ROLE_NAMES),
  permissions: permissionMapSchema,
});

export type Role = z.infer<typeof roleSchema>;
