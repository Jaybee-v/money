"use client";

import { getObligatoryExpenses } from "@/actions/obligatoryExpense.action";
import { ObligatoryExpense, User } from "@prisma/client";
import { addDays, format, isBefore, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface UpcomingObligatoryExpensesProps {
  user: User;
}

const isExpenseUpcoming = (expense: ObligatoryExpense): boolean => {
  const today = new Date();
  const fiveDaysFromNow = addDays(today, 5);
  const startDate = new Date(expense.startDate);

  // Si la dépense est archivée, on ne la montre pas
  if (expense.isArchived) return false;

  // Obtenir le jour du mois du prélèvement
  const dayOfMonth = startDate.getDate();

  // Créer une date pour ce mois avec le même jour
  const thisMonthDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    dayOfMonth
  );

  // Si on a dépassé le jour dans le mois courant, regarder le mois prochain
  const targetDate = isBefore(thisMonthDate, today)
    ? new Date(today.getFullYear(), today.getMonth() + 1, dayOfMonth)
    : thisMonthDate;

  // Vérifier si la date tombe dans les 5 prochains jours
  const isInNextFiveDays = isWithinInterval(targetDate, {
    start: today,
    end: fiveDaysFromNow,
  });

  if (!isInNextFiveDays) return false;

  // Vérifier la récurrence
  const monthsSinceStart =
    (targetDate.getFullYear() - startDate.getFullYear()) * 12 +
    (targetDate.getMonth() - startDate.getMonth());

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
};

export const UpcomingObligatoryExpenses = ({
  user,
}: UpcomingObligatoryExpensesProps) => {
  const [upcomingExpenses, setUpcomingExpenses] = useState<ObligatoryExpense[]>(
    []
  );

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await getObligatoryExpenses(user.id);
      if (response.obligatoryExpenses) {
        const upcoming = response.obligatoryExpenses.filter(isExpenseUpcoming);
        setUpcomingExpenses(upcoming);
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
        <ul className="space-y-4">
          {upcomingExpenses.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Aucun prélèvement à venir
            </p>
          ) : (
            upcomingExpenses.map((expense) => {
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
                    <p className="font-medium">{expense.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Prévu le {format(targetDate, "d MMMM", { locale: fr })}
                    </p>
                  </div>
                  <span className="font-bold">{expense.amount} €</span>
                </li>
              );
            })
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
