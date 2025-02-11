"use server";

import { CreateObligatoryRecipeDto } from "@/lib/dtos/CreateObligatoryRecipeDto";
import { UpdateObligatoryRecipeDto } from "@/lib/dtos/UpdateObligatoryRecipeDto";
import prisma from "@/lib/prisma";

export const createObligatoryRecipe = async (
  recipe: CreateObligatoryRecipeDto
) => {
  const _recipe = await prisma.obligatoryRecipe.create({
    data: recipe,
  });

  if (!_recipe) {
    return { error: "Erreur lors de la création de la recette obligatoire" };
  }

  return { success: "Recette obligatoire créée avec succès", data: _recipe };
};

export const getObligatoryRecipes = async (userId: string) => {
  const _obligatoryRecipes = await prisma.obligatoryRecipe.findMany({
    where: { userId },
  });

  if (!_obligatoryRecipes) {
    return {
      error: "Erreur lors de la récupération des recettes obligatoires",
    };
  }

  return {
    obligatoryRecipes: _obligatoryRecipes,
  };
};

export const updateObligatoryRecipe = async (
  recipe: UpdateObligatoryRecipeDto
) => {
  const _recipe = await prisma.obligatoryRecipe.update({
    where: { id: recipe.id },
    data: recipe,
  });

  if (!_recipe) {
    return {
      error: "Erreur lors de la mise à jour de la recette obligatoire",
    };
  }

  return {
    success: "Recette obligatoire mise à jour avec succès",
    data: _recipe,
  };
};

export const deleteObligatoryRecipe = async (recipeId: string) => {
  const _recipe = await prisma.obligatoryRecipe.delete({
    where: { id: recipeId },
  });

  if (!_recipe) {
    return {
      error: "Erreur lors de la suppression de la recette obligatoire",
    };
  }

  return { success: "Recette obligatoire supprimée avec succès" };
};

export const archiveObligatoryRecipe = async (recipeId: string) => {
  const _recipe = await prisma.obligatoryRecipe.update({
    where: { id: recipeId },
    data: { isArchived: true, archivedAt: new Date() },
  });

  if (!_recipe) {
    return {
      error: "Erreur lors de l'archivage de la recette obligatoire",
    };
  }

  return { success: "Recette obligatoire archivée avec succès" };
};
