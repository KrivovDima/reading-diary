import z from "zod";

export const registerShema = z
  .object({
    name: z.string().min(3, "User name must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine(({ confirmPassword, password }) => password === confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });
