"use client";

import { createExpense, getExpensesByMonth } from "@/actions/expense.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExpenseFormSchema } from "@/lib/definitions/expense.definition";
import { CreateExpenseDto } from "@/lib/dtos/CreateExpenseDto";
import { Expense, User } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ExpenseForm } from "../forms/ExpenseForm";
import { ExpenseTable } from "../tables/ExpenseTable";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ExpensePageViewProps {
  user: User;
}

export const ExpensePageView = ({ user }: ExpensePageViewProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await getExpensesByMonth({
        userId: user.id,
        month: selectedMonth,
        year: selectedYear,
      });
      console.log(response);
      if (response.data) {
        setExpenses(response.data);
      }
    };

    fetchExpenses();
  }, [selectedMonth, selectedYear, user.id]);

  // Générer les 12 derniers mois
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2024, i, 1), "MMMM", { locale: fr }),
  }));

  // Générer les 5 dernières années
  const years = Array.from({ length: 5 }, (_, i) => {
    const year = today.getFullYear() - i;
    return {
      value: year,
      label: year.toString(),
    };
  });

  const onSubmitExpense = async (data: z.infer<typeof ExpenseFormSchema>) => {
    console.log(data);
    const createExpenseDto: CreateExpenseDto = {
      name: data.name,
      amount: Number(data.amount),
      userId: data.userId,
      date: new Date(data.date),
    };

    const response = await createExpense(createExpenseDto);
    if (response.success) {
      setExpenses((prev) => [...prev, response.data]);
    }
    return response;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Historique des dépenses</h2>
        <div className="flex gap-2">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value.toString()}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(Number(value))}
          >
            <SelectTrigger className="w-[160px] capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem
                  key={month.value}
                  value={month.value.toString()}
                  className="capitalize"
                >
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section>
        <Dialog>
          <DialogTrigger>
            <Button>Ajouter une dépense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une dépense</DialogTitle>
              <DialogDescription>
                Ajoutez une dépense pour ce mois
              </DialogDescription>
            </DialogHeader>
            <section>
              <ExpenseForm userId={user.id} onSubmit={onSubmitExpense} />
            </section>
          </DialogContent>
        </Dialog>
      </section>

      {expenses.length > 0 ? (
        <ExpenseTable expenses={expenses} />
      ) : (
        <p className="text-center text-muted-foreground">
          Aucune dépense pour ce mois
        </p>
      )}
    </div>
  );
};
