"use client";

import { getObligatoryExpenses } from "@/actions/obligatoryExpense.action";
import { ObligatoryExpense, User } from "@prisma/client";
import { format, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface UpcomingObligatoryExpensesProps {
  user: User;
}

export const UpcomingObligatoryExpenses = ({
  user,
}: UpcomingObligatoryExpensesProps) => {
  const [expenses, setExpenses] = useState<ObligatoryExpense[]>([]);
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await getObligatoryExpenses(user.id);
      if (response.obligatoryExpenses) {
        const upcomingExpenses = response.obligatoryExpenses.filter(
          (expense) => {
            const startDate = new Date(expense.startDate);

            // Vérifier si la dépense est active pour le mois prochain
            if (expense.isArchived || startDate > nextMonth) return false;

            const monthsSinceStart =
              (nextMonth.getFullYear() - startDate.getFullYear()) * 12 +
              (nextMonth.getMonth() - startDate.getMonth());

            switch (expense.recurrence) {
              case "MONTHLY":
                return true;
              case "BIMONTHLY":
                return monthsSinceStart % 2 === 0;
              case "QUARTERLY":
                return monthsSinceStart % 3 === 0;
              case "BIANNUAL":
                return monthsSinceStart % 6 === 0;
              case "ANNUAL":
                return monthsSinceStart % 12 === 0;
              default:
                return false;
            }
          }
        );

        setExpenses(upcomingExpenses);
      }
    };

    fetchExpenses();
  }, [user.id]);

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-amber-600">Prélèvements à venir</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {expenses.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Aucun prélèvement à venir
            </p>
          ) : (
            expenses.map((expense) => {
              const date = new Date(expense.startDate);
              const dayOfMonth = date.getDate();
              const today = new Date();
              const targetDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                dayOfMonth
              );

              if (isBefore(targetDate, today)) {
                targetDate.setMonth(targetDate.getMonth() + 1);
              }

              return (
                <li
                  key={expense.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">{expense.name}</p>
                    <p className="text-xs text-gray-400">
                      Prévu le {format(targetDate, "d MMMM", { locale: fr })}
                    </p>
                  </div>
                  <span className="font-bold text-sm">{expense.amount} €</span>
                </li>
              );
            })
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
