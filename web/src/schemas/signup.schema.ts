import * as z from "zod";

import { passwordSchema } from "./password.schema";

export const signupSchema = z
  .object({
    name: z.string().min(3, "Insira seu nome completo"),
    email: z.email("Insira um e-mail válido"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
