export type UpdateExpenseDto = {
  id: string;
  name: string;
  amount: number;
  userId: string;
  date: Date;
  categoryId: string | null;
};
