"use client";

import {
  getCategoriesExpense,
  getExpensesByYear,
} from "@/actions/expense.action";
import { getObligatoryExpenses } from "@/actions/obligatoryExpense.action";
import { getObligatoryRecipes } from "@/actions/obligatoryRecipe.action";
import { getRecipesByYear } from "@/actions/recipe.action";
import { ObligatoryExpense, ObligatoryRecipe, User } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  TooltipProps as RechartsTooltipProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
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
  expenses: {
    categorized: { [categoryId: string]: number };
    uncategorized: number;
  };
  obligatory: number;
  recipes: number;
  obligatoryRecipes: number;
  balance: number;
}

interface CategoryExpense {
  id: string;
  name: string;
}

type TooltipProps = RechartsTooltipProps<number, string>;

type PayloadEntry = Payload<number, string>;

export function ExpenseYearlyChart({ user }: ExpenseYearlyChartProps) {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [categories, setCategories] = useState<CategoryExpense[]>([]);
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const isExpenseActiveForMonth = (
    item: ObligatoryExpense | ObligatoryRecipe,
    currentDate: Date,
    nextMonthDate: Date
  ) => {
    const today = new Date();
    const isRecipe = "date" in item;
    const itemDate = new Date(isRecipe ? item.date : item.startDate);
    const itemMonth = new Date(itemDate.getFullYear(), itemDate.getMonth(), 1);

    // Si l'item est archivé
    if (
      item.isArchived &&
      item.archivedAt &&
      currentDate >= new Date(item.archivedAt)
    ) {
      return false;
    }

    // Ne pas afficher si le mois est avant la date de début ou après le mois en cours
    if (
      currentDate < itemMonth ||
      currentDate > new Date(today.getFullYear(), today.getMonth(), 1)
    ) {
      return false;
    }

    const monthsSinceStart =
      (currentDate.getFullYear() - itemDate.getFullYear()) * 12 +
      (currentDate.getMonth() - itemDate.getMonth());

    // Si on est dans le mois en cours
    if (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    ) {
      if (today.getDate() < itemDate.getDate()) return false;
    }

    return (
      item.recurrence === "MONTHLY" ||
      (item.recurrence === "BIMONTHLY" && monthsSinceStart % 2 === 0) ||
      (item.recurrence === "QUARTERLY" && monthsSinceStart % 3 === 0) ||
      (item.recurrence === "BIANNUAL" && monthsSinceStart % 6 === 0) ||
      (item.recurrence === "ANNUAL" && monthsSinceStart % 12 === 0)
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategoriesExpense(user.id);
      if (response.data) {
        setCategories(response.data);
      }
    };
    fetchCategories();
  }, [user.id]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        expensesResponse,
        obligatoryResponse,
        recipesResponse,
        obligatoryRecipesResponse,
      ] = await Promise.all([
        getExpensesByYear({ userId: user.id, year: selectedYear }),
        getObligatoryExpenses(user.id),
        getRecipesByYear({ userId: user.id, year: selectedYear }),
        getObligatoryRecipes(user.id),
      ]);

      if (
        expensesResponse.data &&
        obligatoryResponse.obligatoryExpenses &&
        recipesResponse.data &&
        obligatoryRecipesResponse.obligatoryRecipes
      ) {
        const monthlyData = Array.from({ length: 12 }, (_, month) => {
          const currentDate = new Date(selectedYear, month, 1);
          const nextMonthDate = new Date(selectedYear, month + 1, 0);

          // Calculer les dépenses par catégorie
          const monthExpenses = expensesResponse.data.filter(
            (expense) => new Date(expense.date).getMonth() === month
          );

          const expensesByCategory = monthExpenses.reduce(
            (acc, expense) => {
              if (expense.category?.id) {
                acc.categorized[expense.category.id] =
                  (acc.categorized[expense.category.id] || 0) + expense.amount;
              } else {
                acc.uncategorized += expense.amount;
              }
              return acc;
            },
            { categorized: {} as { [key: string]: number }, uncategorized: 0 }
          );

          const monthlyObligatory =
            obligatoryResponse.obligatoryExpenses.reduce((sum, expense) => {
              if (
                isExpenseActiveForMonth(expense, currentDate, nextMonthDate)
              ) {
                return sum + expense.amount;
              }
              return sum;
            }, 0);

          const monthlyObligatoryRecipes =
            obligatoryRecipesResponse.obligatoryRecipes.reduce(
              (sum, recipe) => {
                if (
                  isExpenseActiveForMonth(recipe, currentDate, nextMonthDate)
                ) {
                  return sum + recipe.amount;
                }
                return sum;
              },
              0
            );

          const monthRecipes =
            recipesResponse.data.find((item) => item.month === month)?.total ||
            0;

          const totalExpenses =
            Object.values(expensesByCategory.categorized).reduce(
              (sum, amount) => sum + amount,
              0
            ) + monthlyObligatory;

          const totalRecipes = monthRecipes + monthlyObligatoryRecipes;

          return {
            name: format(currentDate, "MMM", { locale: fr }),
            expenses: {
              categorized: expensesByCategory.categorized,
              uncategorized: expensesByCategory.uncategorized,
            },
            obligatory: monthlyObligatory,
            recipes: monthRecipes,
            obligatoryRecipes: monthlyObligatoryRecipes,
            balance: totalRecipes - totalExpenses,
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
    ...chartData.map((item) => {
      const totalExpenses =
        Object.values(item.expenses.categorized).reduce(
          (sum, amount) => sum + amount,
          0
        ) +
        item.expenses.uncategorized +
        item.obligatory;
      return Math.max(item.recipes, totalExpenses);
    }),
    1
  );
  const yAxisTicks = Array.from({ length: 6 }, (_, i) =>
    Math.round(maxAmount * (i / 5))
  ).filter((value, index, self) => self.indexOf(value) === index);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Aperçu annuel</CardTitle>
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
                  if (name === "obligatory")
                    return [`${value}€`, "Dépenses obligatoires"];
                  if (name === "recipes")
                    return [`${value}€`, "Entrées d'argent"];
                  if (name === "uncategorized")
                    return [`${value}€`, "Non catégorisées"];
                  const category = categories.find((cat) => cat.id === name);
                  return [`${value}€`, category?.name || name];
                }}
                cursor={{ fill: "transparent" }}
                content={(props: TooltipProps) => {
                  if (!props.active || !props.payload) return null;

                  const formatName = (entry: PayloadEntry) => {
                    const dataKey = entry.dataKey?.toString() || "";
                    if (dataKey === "obligatory") return "Dépenses récurrentes";
                    if (dataKey === "recipes") return "Entrées d'argent";
                    if (dataKey === "expenses.uncategorized")
                      return "Non catégorisées";
                    if (dataKey === "obligatoryRecipes")
                      return "Recettes récurrentes";
                    const categoryId = dataKey.split(".")[2];
                    const category = categories.find(
                      (cat) => cat.id === categoryId
                    );

                    return category?.name || entry.name;
                  };

                  const totalExpenses = props.payload.reduce(
                    (sum: number, entry: Payload<number, string>) => {
                      if (
                        entry.dataKey?.toString().includes("expenses") ||
                        entry.dataKey === "obligatory"
                      ) {
                        return sum + (entry.value || 0);
                      }
                      return sum;
                    },
                    0
                  );

                  return (
                    <div className="bg-white p-2 border rounded-lg shadow-sm">
                      {props.payload.map(
                        (entry: PayloadEntry, index: number) => (
                          <div
                            key={index}
                            className="text-xs flex items-center gap-2"
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span>
                              {formatName(entry)}: {entry.value}€
                            </span>
                          </div>
                        )
                      )}
                      <div className="border-t mt-1 pt-1 text-xs font-semibold">
                        Total dépenses: {totalExpenses}€
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                formatter={(value) => {
                  if (value === "obligatory") return "Dépenses obligatoires";
                  if (value === "recipes") return "Entrées d'argent";
                  if (value === "uncategorized") return "Non catégorisées";
                  const category = categories.find((cat) => cat.id === value);
                  return category?.name || value;
                }}
                wrapperStyle={{ fontSize: "10px" }}
              />
              {/* Dépenses par catégorie */}
              {categories.map((category, index) => (
                <Bar
                  key={category.id}
                  dataKey={`expenses.categorized.${category.id}`}
                  name={category.name}
                  stackId="expenses"
                  fill={`hsl(${index * 30}, 70%, 50%)`}
                  radius={[0, 0, 0, 0]}
                />
              ))}
              <Bar
                dataKey="expenses.uncategorized"
                name="uncategorized"
                stackId="expenses"
                fill="#94a3b8"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="obligatory"
                stackId="expenses"
                fill="#fbbf24"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="recipes"
                stackId="recipes"
                fill="#22c55e"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="obligatoryRecipes"
                stackId="recipes"
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
