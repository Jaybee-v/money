"use client";

import { createRecipe, getRecipesByMonth } from "@/actions/recipe.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RecipeFormSchema } from "@/lib/definitions/recipe.definition";
import { CreateRecipeDto } from "@/lib/dtos/CreateRecipeDto";
import { Recipe } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { z } from "zod";
import { RecipeForm } from "../forms/RecipeForm";
import { RecipesTable } from "../tables/RecipesTable";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface RecipePageViewProps {
  userId: string;
}

export const RecipePageView = ({ userId }: RecipePageViewProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await getRecipesByMonth({
        userId: userId,
        month: selectedMonth,
        year: selectedYear,
      });
      if (response) {
        setRecipes(response);
      }
    };

    fetchRecipes();
  }, [selectedMonth, selectedYear, userId]);

  // Générer les 12 derniers mois
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2024, i, 1), "MMMM", { locale: fr }),
  }));

  // Générer les 5 dernières années
  const years = Array.from({ length: 5 }, (_, i) => {
    const year = today.getFullYear() - i;
    return {
      value: year,
      label: year.toString(),
    };
  });

  const onSubmitRecipe = async (data: z.infer<typeof RecipeFormSchema>) => {
    console.log(data);
    const createRecipeDto: CreateRecipeDto = {
      name: data.name,
      amount: Number(data.amount),
      userId: data.userId,
      date: new Date(data.date),
    };
    const response = await createRecipe(createRecipeDto);
    if (response.success) {
      setRecipes((prev) => [...prev, response.data]);
    }
    return response;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Historique des recettes</h2>
      </div>

      <section>
        <Dialog>
          <DialogTrigger>
            <Button>Ajouter une recette</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une recette</DialogTitle>
              <DialogDescription>
                Ajoutez une recette pour ce mois
              </DialogDescription>
            </DialogHeader>

            <section>
              <RecipeForm userId={userId} onSubmit={onSubmitRecipe} />
            </section>
          </DialogContent>
        </Dialog>
      </section>
      <div className="flex gap-2">
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

        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => setSelectedMonth(Number(value))}
        >
          <SelectTrigger className="w-[160px] capitalize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem
                key={month.value}
                value={month.value.toString()}
                className="capitalize"
              >
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {recipes.length > 0 ? (
        <RecipesTable recipes={recipes} />
      ) : (
        <p className="text-center text-muted-foreground">
          Aucune recette pour ce mois
        </p>
      )}
    </div>
  );
};
