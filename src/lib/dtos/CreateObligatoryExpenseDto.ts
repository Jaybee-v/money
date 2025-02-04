import { RecurrenceType } from "@prisma/client";

export type CreateObligatoryExpenseDto = {
  name: string;
  amount: number;
  userId: string;
  startDate: Date;
  recurrence: RecurrenceType;
};
