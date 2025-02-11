import { RecurrenceType } from "@prisma/client";

export type UpdateObligatoryExpenseDto = {
  id: string;
  name: string;
  amount: number;
  userId: string;
  startDate: Date;
  recurrence: RecurrenceType;
};
