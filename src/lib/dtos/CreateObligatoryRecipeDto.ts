import { RecurrenceType } from "@prisma/client";

export type CreateObligatoryRecipeDto = {
  name: string;
  amount: number;
  userId: string;
  date: Date;
  recurrence: RecurrenceType;
};
