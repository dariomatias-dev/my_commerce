import * as z from "zod";

export const recoverSchema = z.object({
  email: z.email("Insira um e-mail válido"),
});
