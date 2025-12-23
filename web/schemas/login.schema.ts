import * as z from "zod";

import { passwordSchema } from "./password.schema";

export const loginSchema = z.object({
  email: z.email("Insira um e-mail válido"),
  password: passwordSchema,
});
