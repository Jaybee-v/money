import { RecurrenceType } from "@prisma/client";

export type UpdateObligatoryRecipeDto = {
  id: string;
  name: string;
  amount: number;
  userId: string;
  date: Date;
  recurrence: RecurrenceType;
};
