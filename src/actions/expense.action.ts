"use server";

import { CreateExpenseDto } from "@/lib/dtos/CreateExpenseDto";
import prisma from "@/lib/prisma";

export const createExpense = async (expense: CreateExpenseDto) => {
  const _expense = await prisma.expense.create({
    data: expense,
  });

  if (!_expense) {
    return {
      error: "Erreur lors de la création de l'expéditure",
    };
  }

  return {
    success: "Dépense créée avec succès",
    data: _expense,
  };
};

interface GetExpensesByMonthParams {
  userId: string;
  month: number;
  year: number;
}

export const getExpensesByMonth = async ({
  userId,
  month,
  year,
}: GetExpensesByMonthParams) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        AND: [
          {
            date: {
              gte: new Date(year, month, 1),
            },
          },
          {
            date: {
              lt: new Date(year, month + 1, 1),
            },
          },
        ],
      },
      orderBy: {
        date: "desc",
      },
    });

    return {
      success: "Dépenses récupérées avec succès",
      data: expenses,
    };
  } catch {
    return {
      error: "Erreur lors de la récupération des dépenses",
    };
  }
};

interface GetExpensesByYearParams {
  userId: string;
  year: number;
}

export const getExpensesByYear = async ({
  userId,
  year,
}: GetExpensesByYearParams) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        AND: [
          {
            date: {
              gte: new Date(year, 0, 1),
            },
          },
          {
            date: {
              lt: new Date(year + 1, 0, 1),
            },
          },
        ],
      },
    });

    // Grouper par mois et calculer le total
    const monthlyTotals = Array.from({ length: 12 }, (_, month) => {
      const monthExpenses = expenses.filter(
        (expense) => new Date(expense.date).getMonth() === month
      );
      return {
        month: month,
        total: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      };
    });

    return {
      success: "Dépenses récupérées avec succès",
      data: monthlyTotals,
    };
  } catch {
    return {
      error: "Erreur lors de la récupération des dépenses",
    };
  }
};
