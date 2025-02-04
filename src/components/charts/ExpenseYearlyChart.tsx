"use client";

import { getExpensesByYear } from "@/actions/expense.action";
import { getObligatoryExpenses } from "@/actions/obligatoryExpense.action";
import { getRecipesByYear } from "@/actions/recipe.action";
import { ObligatoryExpense, User } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ExpenseYearlyChartProps {
  user: User;
}

interface MonthlyData {
  name: string;
  expenses: number;
  obligatory: number;
  recipes: number;
  balance: number;
}

export function ExpenseYearlyChart({ user }: ExpenseYearlyChartProps) {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const isExpenseActiveForMonth = (
    expense: ObligatoryExpense,
    currentDate: Date,
    nextMonthDate: Date
  ) => {
    const startDate = new Date(expense.startDate);
    const today = new Date();

    // Si la date de début n'est pas encore atteinte
    if (startDate > nextMonthDate) {
      return false;
    }

    // Si la dépense est archivée et que nous sommes après la date d'archivage
    if (
      expense.isArchived &&
      expense.archivedAt &&
      currentDate >= new Date(expense.archivedAt)
    ) {
      return false;
    }

    // Calculer le nombre de mois depuis le début
    const monthsSinceStart =
      (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
      (currentDate.getMonth() - startDate.getMonth());

    // Si on est dans le même mois et la même année
    if (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    ) {
      // Vérifier si on a dépassé le jour du prélèvement ET si la récurrence correspond
      if (today.getDate() >= startDate.getDate()) {
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
      return false;
    }

    // Pour les mois passés, afficher si le mois correspond à la récurrence
    if (currentDate < today) {
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

    return false;
  };

  useEffect(() => {
    const fetchData = async () => {
      const expensesResponse = await getExpensesByYear({
        userId: user.id,
        year: selectedYear,
      });

      const obligatoryResponse = await getObligatoryExpenses(user.id);
      const recipesResponse = await getRecipesByYear({
        userId: user.id,
        year: selectedYear,
      });

      if (
        expensesResponse.data &&
        obligatoryResponse.obligatoryExpenses &&
        recipesResponse.data
      ) {
        const monthlyData = Array.from({ length: 12 }, (_, month) => {
          const currentDate = new Date(selectedYear, month, 1);
          const nextMonthDate = new Date(selectedYear, month + 1, 0);

          const monthlyObligatory =
            obligatoryResponse.obligatoryExpenses.reduce((sum, expense) => {
              if (
                isExpenseActiveForMonth(expense, currentDate, nextMonthDate)
              ) {
                return sum + expense.amount;
              }
              return sum;
            }, 0);

          const monthExpenses =
            expensesResponse.data.find((item) => item.month === month)?.total ||
            0;
          const monthRecipes =
            recipesResponse.data.find((item) => item.month === month)?.total ||
            0;

          const totalExpenses = monthExpenses + monthlyObligatory;

          return {
            name: format(currentDate, "MMM", { locale: fr }),
            expenses: monthExpenses,
            obligatory: monthlyObligatory,
            recipes: monthRecipes,
            balance: monthRecipes - totalExpenses,
          };
        });

        setChartData(monthlyData);
      }
    };

    fetchData();
  }, [selectedYear, user.id]);

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = today.getFullYear() - i;
    return {
      value: year,
      label: year.toString(),
    };
  });

  const maxAmount = Math.max(
    ...chartData.map((item) =>
      Math.max(item.recipes, item.expenses + item.obligatory)
    ),
    1
  );
  const yAxisTicks = Array.from({ length: 6 }, (_, i) =>
    Math.round(maxAmount * (i / 5))
  ).filter((value, index, self) => self.indexOf(value) === index);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Aperçu annuel des dépenses</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                ticks={yAxisTicks}
                tickFormatter={(value) => `${value}€`}
                domain={[0, Math.ceil(maxAmount * 1.1)]}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  const label =
                    name === "obligatory"
                      ? "Dépenses obligatoires"
                      : name === "expenses"
                      ? "Dépenses variables"
                      : name === "recipes"
                      ? "Entrées d'argent"
                      : "Balance";
                  return [`${value}€`, label];
                }}
                cursor={{ fill: "transparent" }}
              />
              <Legend
                formatter={(value) => {
                  return value === "obligatory"
                    ? "Dépenses obligatoires"
                    : value === "expenses"
                    ? "Dépenses variables"
                    : value === "recipes"
                    ? "Entrées d'argent"
                    : "Balance";
                }}
              />
              <Bar
                dataKey="obligatory"
                stackId="expenses"
                fill="#fbbf24"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                stackId="expenses"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="recipes" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
