"use server";

import { CreateRecipeDto } from "@/lib/dtos/CreateRecipeDto";
import prisma from "@/lib/prisma";

export const createRecipe = async (recipe: CreateRecipeDto) => {
  const newRecipe = await prisma.recipe.create({
    data: recipe,
  });

  if (!newRecipe) {
    return {
      error: "Erreur lors de la création de la recette",
    };
  }

  return {
    success: "Recette créée avec succès",
    data: newRecipe,
  };
};

export const getRecipesByMonth = async ({
  userId,
  month,

  year,
}: {
  userId: string;
  month: number;
  year: number;
}) => {
  const recipes = await prisma.recipe.findMany({
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

  return recipes;
};

interface GetRecipesByYearParams {
  userId: string;
  year: number;
}

export const getRecipesByYear = async ({
  userId,
  year,
}: GetRecipesByYearParams) => {
  try {
    const recipes = await prisma.recipe.findMany({
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
      const monthRecipes = recipes.filter(
        (recipe) => new Date(recipe.date).getMonth() === month
      );
      return {
        month: month,
        total: monthRecipes.reduce((sum, recipe) => sum + recipe.amount, 0),
      };
    });

    return {
      success: "Recettes récupérées avec succès",
      data: monthlyTotals,
    };
  } catch {
    return {
      error: "Erreur lors de la récupération des recettes",
    };
  }
};
