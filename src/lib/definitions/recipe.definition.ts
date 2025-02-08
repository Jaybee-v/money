import { z } from "zod";
import { RecurrenceTypeSchema } from "./expense.definition";

export const ObligatoryRecipeFormSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  amount: z.string().min(1, { message: "Le montant est requis" }),
  userId: z.string().min(1, { message: "L'utilisateur est requis" }),
  date: z.string().min(1, { message: "La date de début est requise" }),
  recurrence: RecurrenceTypeSchema,
});

export const RecipeFormSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  amount: z.string().min(1, { message: "Le montant est requis" }),
  date: z.string().min(1, { message: "La date est requise" }),
  userId: z.string().min(1, { message: "L'utilisateur est requis" }),
});
