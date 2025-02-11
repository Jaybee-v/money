"use client";
import {
  archiveObligatoryRecipe,
  createObligatoryRecipe,
  deleteObligatoryRecipe,
  getObligatoryRecipes,
} from "@/actions/obligatoryRecipe.action";
import { ObligatoryRecipeFormSchema } from "@/lib/definitions/recipe.definition";
import { CreateObligatoryRecipeDto } from "@/lib/dtos/CreateObligatoryRecipeDto";
import { ObligatoryRecipe, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ObligatoryRecipeForm } from "../forms/ObligatoryRecipeForm";
import { ObligatoryRecipeTable } from "../tables/ObligatoryRecipeTable";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ObligatoryRecipesPageViewProps {
  user: User;
}

export const ObligatoryRecipesPageView = ({
  user,
}: ObligatoryRecipesPageViewProps) => {
  const [obligatoryRecipes, setObligatoryRecipes] = useState<
    ObligatoryRecipe[]
  >([]);

  useEffect(() => {
    const fetchObligatoryRecipes = async () => {
      const response = await getObligatoryRecipes(user.id);
      if (response.error) {
        console.error(response.error);
      }
      if (response.obligatoryRecipes) {
        setObligatoryRecipes(response.obligatoryRecipes);
      }
    };
    fetchObligatoryRecipes();
  }, [user.id]);

  const onSubmit = async (data: z.infer<typeof ObligatoryRecipeFormSchema>) => {
    console.log(data);
    const createObligatoryRecipeDto: CreateObligatoryRecipeDto = {
      name: data.name,
      amount: Number(data.amount),
      userId: data.userId,
      date: new Date(data.date),
      recurrence: data.recurrence,
    };
    const response = await createObligatoryRecipe(createObligatoryRecipeDto);
    if (response.error) {
      console.error(response.error);
      return;
    }
    if (response.success) {
      console.log(response.success);
      setObligatoryRecipes((prev) => [...prev, response.data]);
    }
  };

  const onDelete = async (recipeId: string) => {
    const response = await deleteObligatoryRecipe(recipeId);
    console.log(response);
    if (response.error) {
      console.error(response.error);
    }
    if (response.success) {
      console.log(response.success);
      setObligatoryRecipes((prev) =>
        prev.filter((recipe) => recipe.id !== recipeId)
      );
    }
  };

  const onArchive = async (recipeId: string) => {
    const response = await archiveObligatoryRecipe(recipeId);
    console.log(response);
    if (response.error) {
      console.error(response.error);
    }
    if (response.success) {
      console.log(response.success);
      const reload = await getObligatoryRecipes(user.id);
      if (reload.error) {
        console.error(reload.error);
      }
      if (reload.obligatoryRecipes) {
        setObligatoryRecipes(reload.obligatoryRecipes);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">
        Gérez vos recettes récurrentes
      </h1>
      <p className="text-sm text-center text-muted-foreground">
        Vous pouvez ajouter des recettes récurrentes pour vous aider à gérer
        votre budget.
      </p>
      <section className="flex max-md:flex-col justify-evenly">
        <Card className="max-w-sm mx-auto">
          <CardHeader>
            <CardTitle>Ajouter une recette récurrente</CardTitle>
          </CardHeader>
          <CardContent>
            <ObligatoryRecipeForm userId={user.id} onSubmit={onSubmit} />
          </CardContent>
        </Card>
        <section className="mt-4 w-full max-w-4xl mx-auto space-y-4">
          {obligatoryRecipes.length > 0 ? (
            <ObligatoryRecipeTable
              obligatoryRecipes={obligatoryRecipes}
              onDelete={onDelete}
              onArchive={onArchive}
              user={user}
            />
          ) : (
            <p className="text-center text-sm text-muted-foreground my-12">
              Aucune recette récurrente renseignée
            </p>
          )}
        </section>
      </section>
    </div>
  );
};
