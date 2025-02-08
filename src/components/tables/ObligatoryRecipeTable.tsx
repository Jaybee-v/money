import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArchiveRestore, Check, Trash } from "lucide-react";

import { ObligatoryRecipe } from "@prisma/client";
import { useState } from "react";
import { Button } from "../ui/button";

interface ObligatoryRecipeTableProps {
  obligatoryRecipes: ObligatoryRecipe[];
  onDelete: (recipeId: string) => void;
  onArchive: (recipeId: string) => void;
}

export const ObligatoryRecipeTable = ({
  obligatoryRecipes,
  onDelete,
  onArchive,
}: ObligatoryRecipeTableProps) => {
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const [recipeToArchive, setRecipeToArchive] = useState<string | null>(null);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Dénomination</TableHead>
          <TableHead className="text-right">Montant (en €)</TableHead>
          <TableHead className="text-right">Date de prélèvement</TableHead>
          <TableHead className="text-right">Récurrence</TableHead>
          <TableHead className="text-center">Archivée</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {obligatoryRecipes.map((obligatory) => (
          <TableRow key={obligatory.id}>
            <TableCell className="font-medium">{obligatory.name}</TableCell>
            <TableCell className="text-right">{obligatory.amount} €</TableCell>
            <TableCell className="text-right">
              {new Date(obligatory.date).getDate()} du mois
            </TableCell>
            <TableCell className="text-right">
              {obligatory.recurrence === "MONTHLY"
                ? "Tous les mois"
                : obligatory.recurrence === "BIMONTHLY"
                ? "Tous les 2 mois"
                : obligatory.recurrence === "QUARTERLY"
                ? "Tous les 3 mois"
                : obligatory.recurrence === "ANNUAL"
                ? "Une fois / an"
                : "Tous les 6 mois"}
            </TableCell>
            <TableCell className="flex justify-center">
              {obligatory.isArchived ? (
                <Check className="text-amber-600" />
              ) : (
                ""
              )}
            </TableCell>
            <TableCell className="text-right">
              {!obligatory.isArchived && (
                <AlertDialog
                  open={recipeToArchive === obligatory.id}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) setRecipeToArchive(null);
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-amber-600 hover:text-amber-600 hover:bg-amber-600/10"
                    onClick={() => setRecipeToArchive(obligatory.id)}
                  >
                    <ArchiveRestore className="h-4 w-4" />
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous sûr de vouloir archiver ce prélèvement ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Si vous archivez ce prélèvement, il ne sera plus pris en
                        compte dans le calcul de votre budget à partir de la
                        date de mise en archive.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-amber-600 hover:bg-amber-600/90"
                        onClick={() => {
                          if (recipeToArchive) {
                            onArchive(recipeToArchive);
                            setRecipeToArchive(null);
                          }
                        }}
                      >
                        Archiver
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <AlertDialog
                open={recipeToDelete === obligatory.id}
                onOpenChange={(isOpen) => {
                  if (!isOpen) setRecipeToDelete(null);
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-600 hover:bg-red-600/10"
                  onClick={() => setRecipeToDelete(obligatory.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Êtes-vous sûr de vouloir supprimer ce prélèvement ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-600/90"
                      onClick={() => {
                        if (recipeToDelete) {
                          onDelete(recipeToDelete);
                          setRecipeToDelete(null);
                        }
                      }}
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
