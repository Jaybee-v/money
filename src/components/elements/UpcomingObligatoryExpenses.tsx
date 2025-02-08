"use client";

import { getObligatoryExpenses } from "@/actions/obligatoryExpense.action";
import { getObligatoryRecipes } from "@/actions/obligatoryRecipe.action";
import { ObligatoryExpense, ObligatoryRecipe, User } from "@prisma/client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface UpcomingObligatoryExpensesProps {
  user: User;
}

export const UpcomingObligatoryExpenses = ({
  user,
}: UpcomingObligatoryExpensesProps) => {
  const [expenses, setExpenses] = useState<ObligatoryExpense[]>([]);
  const [recipes, setRecipes] = useState<ObligatoryRecipe[]>([]);
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const isRecurrentItemActive = (
    item: ObligatoryExpense | ObligatoryRecipe,
    startDate: Date
  ) => {
    if (item.isArchived || startDate > nextMonth) return false;

    const monthsSinceStart =
      (nextMonth.getFullYear() - startDate.getFullYear()) * 12 +
      (nextMonth.getMonth() - startDate.getMonth());

    switch (item.recurrence) {
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

  useEffect(() => {
    const fetchData = async () => {
      const [expensesResponse, recipesResponse] = await Promise.all([
        getObligatoryExpenses(user.id),
        getObligatoryRecipes(user.id),
      ]);

      if (expensesResponse.obligatoryExpenses) {
        const upcomingExpenses = expensesResponse.obligatoryExpenses.filter(
          (expense) =>
            isRecurrentItemActive(expense, new Date(expense.startDate))
        );
        setExpenses(upcomingExpenses);
      }

      if (recipesResponse.obligatoryRecipes) {
        const upcomingRecipes = recipesResponse.obligatoryRecipes.filter(
          (recipe) => isRecurrentItemActive(recipe, new Date(recipe.date))
        );
        setRecipes(upcomingRecipes);
      }
    };

    fetchData();
  }, [user.id]);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-amber-600">
          Mouvements récurrents à venir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          {expenses.length > 0 && (
            <section className="h-full">
              <h3 className="font-bold text-sm mb-2">Dépenses</h3>
              <ul className="space-y-1">
                {expenses.map((expense) => (
                  <li
                    key={expense.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-xs md:text-sm">
                        {expense.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Prévu le {format(new Date(expense.startDate), "d")}{" "}
                        <span className="hidden md:inline">
                          du mois prochain
                        </span>
                      </p>
                    </div>
                    <span className="font-bold text-sm text-red-600">
                      -{expense.amount} €
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {recipes.length > 0 && (
            <section className="h-full">
              <h3 className="font-bold text-sm mb-2">Entrées</h3>
              <ul className="space-y-1">
                {recipes.map((recipe) => (
                  <li
                    key={recipe.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-xs md:text-sm">
                        {recipe.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Prévu le {format(new Date(recipe.date), "d")}{" "}
                        <span className="hidden md:inline">
                          du mois prochain
                        </span>
                      </p>
                    </div>
                    <span className="font-bold text-sm text-green-600">
                      +{recipe.amount} €
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {expenses.length === 0 && recipes.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Aucun mouvement récurrent à venir
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
