"use client";

import { updateExpense } from "@/actions/expense.action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseFormSchema } from "@/lib/definitions/expense.definition";
import { UpdateExpenseDto } from "@/lib/dtos/UpdateExpenseDto";
import { CategoryExpense, Expense, User } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { z } from "zod";
import { ExpenseForm } from "../forms/ExpenseForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ExpenseTableProps {
  expenses: (Expense & { category: CategoryExpense | null })[];
  user: User;
}

export const ExpenseTable = ({
  expenses: receivedExpenses,
  user,
}: ExpenseTableProps) => {
  const [total, setTotal] = useState(
    receivedExpenses.reduce((acc, expense) => acc + expense.amount, 0)
  );
  const [expenseToEdit, setExpenseToEdit] = useState<
    (Expense & { category: CategoryExpense | null }) | null
  >(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expenses, setExpenses] =
    useState<(Expense & { category: CategoryExpense | null })[]>(
      receivedExpenses
    );

  const handleEditExpense = async (data: z.infer<typeof ExpenseFormSchema>) => {
    if (!expenseToEdit)
      return {
        error: "Aucune dépense sélectionnée",
      };

    const updateExpenseDto: UpdateExpenseDto = {
      id: expenseToEdit.id,
      name: data.name,
      amount: Number(data.amount),
      userId: data.userId,
      date: new Date(data.date),
      categoryId: data.categoryId,
    };
    const response = await updateExpense(updateExpenseDto);

    if (response.success) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === expenseToEdit!.id ? response.data : expense
        )
      );
      setTotal((prev) => prev - expenseToEdit.amount + response.data.amount);
      setIsEditDialogOpen(false);
    }

    return response;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Liste des dépenses</h3>
        <p className="text-lg">
          Total: <span className="font-bold">{total} €</span>
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Dénomination</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Montant (€)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow
              key={expense.id}
              className="cursor-pointer"
              onClick={() => {
                setExpenseToEdit(expense);
                setIsEditDialogOpen(!isEditDialogOpen);
              }}
            >
              <TableCell>
                {format(new Date(expense.date), "d MMMM yyyy", { locale: fr })}
              </TableCell>
              <TableCell>{expense.name}</TableCell>
              <TableCell>
                {expense.category?.name || "Non catégorisée"}
              </TableCell>
              <TableCell className="text-right">{expense.amount} €</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {expenseToEdit && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle>
                Vous souhaitez modifier cette dépense ({expenseToEdit.name}) ?
              </DialogTitle>
              <DialogDescription>
                La modification de cette dépense sera pris en compte
                instantanément.
              </DialogDescription>
              <section>
                <ExpenseForm
                  userId={user.id}
                  onSubmit={handleEditExpense}
                  expense={expenseToEdit}
                />
                {/* <ObligatoryExpenseForm
                    userId={user.id}
                    onSubmit={handleEditObligatoryExpense}
                    obligatoryExpense={expenseToEdit}
                  /> */}
              </section>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
