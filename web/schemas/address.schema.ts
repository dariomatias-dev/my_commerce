import * as z from "zod";

export const addressSchema = z.object({
  label: z.string().min(2, "A identificação deve ter pelo menos 2 caracteres"),
  cep: z.string().min(8, "CEP inválido"),
  street: z.string().min(3, "Rua é obrigatória"),
  number: z.string().min(1, "Nº é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "UF inválida"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
