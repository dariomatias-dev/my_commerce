import * as z from "zod";

export const productSchema = z
  .object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    description: z.string().min(10, "A descrição deve ser mais detalhada"),
    price: z.number().min(0.01, "O preço deve ser maior que zero"),
    stock: z.number().int().min(0, "O estoque não pode ser negativo"),
    categoryId: z.string().min(1, "Selecione uma categoria"),
    active: z.boolean(),
    images: z.array(z.any()),
    existingCount: z.number(),
  })
  .refine((data) => data.images.length + data.existingCount > 0, {
    message: "O produto precisa ter pelo menos uma imagem",
    path: ["images"],
  });

export type ProductFormValues = z.infer<typeof productSchema>;
