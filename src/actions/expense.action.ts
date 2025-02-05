"use server";

import { CreateCategoryExpenseDto } from "@/lib/dtos/CreateCategoryExpenseDto";
import { CreateExpenseDto } from "@/lib/dtos/CreateExpenseDto";
import prisma from "@/lib/prisma";

export const createExpense = async (expense: CreateExpenseDto) => {
  console.log(expense);
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
      include: {
        category: true,
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
      include: {
        category: true,
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

export const getCategoriesExpense = async (userId: string) => {
  const categories = await prisma.categoryExpense.findMany({
    where: {
      userId,
    },
  });

  return {
    success: "Catégories récupérées avec succès",
    data: categories,
  };
};

export const createCategoryExpense = async (
  category: CreateCategoryExpenseDto
) => {
  const _category = await prisma.categoryExpense.create({
    data: category,
  });

  return {
    success: "Catégorie créée avec succès",
    data: _category,
  };
};
