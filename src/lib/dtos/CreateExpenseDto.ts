export type CreateExpenseDto = {
  name: string;
  amount: number;
  userId: string;
  date: Date;
  categoryId: string | null;
};
