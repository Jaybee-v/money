import { z } from "zod";

export const RecipeFormSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  amount: z.string().min(1, { message: "Le montant est requis" }),
  date: z.string().min(1, { message: "La date est requise" }),
  userId: z.string().min(1, { message: "L'utilisateur est requis" }),
});
