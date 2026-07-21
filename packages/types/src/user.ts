import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  roleId: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().optional(),
});

export type User = z.infer<typeof userSchema>;
