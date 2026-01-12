import { z } from "zod";
import { USER_STATUS_ORDER } from "@/types/UserStatusOrder";

export const userStatusSchema = z.enum(USER_STATUS_ORDER);

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .refine((value) => value.trim().length > 0, "Name cannot be empty"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .refine((value) => value.trim().length > 0, "Email cannot be empty"),
  status: userStatusSchema,
  mainProject: z.string(),
});

export const editUserSchema = createUserSchema;

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;
