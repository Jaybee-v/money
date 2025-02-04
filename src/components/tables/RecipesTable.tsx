"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Recipe } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RecipesTableProps {
  recipes: Recipe[];
}

export const RecipesTable = ({ recipes }: RecipesTableProps) => {
  const total = recipes.reduce((acc, recipe) => acc + recipe.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Liste des recettes</h3>
        <p className="text-lg">
          Total: <span className="font-bold">{total} €</span>
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Dénomination</TableHead>
            <TableHead className="text-right">Montant (€)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((recipe) => (
            <TableRow key={recipe.id}>
              <TableCell>
                {format(new Date(recipe.date), "d MMMM yyyy", { locale: fr })}
              </TableCell>
              <TableCell>{recipe.name}</TableCell>
              <TableCell className="text-right">{recipe.amount} €</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
