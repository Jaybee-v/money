"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryExpense, Expense } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ExpenseTableProps {
  expenses: (Expense & { category: CategoryExpense | null })[];
}

export const ExpenseTable = ({ expenses }: ExpenseTableProps) => {
  const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);

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
            <TableRow key={expense.id}>
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
    </div>
  );
};
