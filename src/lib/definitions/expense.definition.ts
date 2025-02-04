import { z } from "zod";

export const RecurrenceTypeSchema = z.enum([
  "MONTHLY",
  "BIMONTHLY",
  "QUARTERLY",
  "BIANNUAL",
  "ANNUAL",
]);

export const ObligatoryExpenseFormSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  amount: z.string().min(1, { message: "Le montant est requis" }),
  userId: z.string().min(1, { message: "L'utilisateur est requis" }),
  startDate: z.string().min(1, { message: "La date de début est requise" }),
  recurrence: RecurrenceTypeSchema,
});

export const ExpenseFormSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  amount: z.string().min(1, { message: "Le montant est requis" }),
  userId: z.string().min(1, { message: "L'utilisateur est requis" }),
  date: z.string().min(1, { message: "La date est requise" }),
});
