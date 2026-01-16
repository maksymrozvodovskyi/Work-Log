import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email"),
  code: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^[0-9]{6}$/, "Code must contain only digits"),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
