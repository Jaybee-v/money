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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArchiveRestore, Check, Trash } from "lucide-react";

import { updateObligatoryRecipe } from "@/actions/obligatoryRecipe.action";
import { ObligatoryRecipeFormSchema } from "@/lib/definitions/recipe.definition";
import { UpdateObligatoryRecipeDto } from "@/lib/dtos/UpdateObligatoryRecipeDto";
import { ObligatoryRecipe, User } from "@prisma/client";
import { useState } from "react";
import { z } from "zod";
import { ObligatoryRecipeForm } from "../forms/ObligatoryRecipeForm";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ObligatoryRecipeTableProps {
  obligatoryRecipes: ObligatoryRecipe[];
  onDelete: (recipeId: string) => void;
  onArchive: (recipeId: string) => void;
  user: User;
}

export const ObligatoryRecipeTable = ({
  obligatoryRecipes: receivedObligatoryRecipes,
  onDelete,
  onArchive,
  user,
}: ObligatoryRecipeTableProps) => {
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const [recipeToArchive, setRecipeToArchive] = useState<string | null>(null);
  const [recipeToEdit, setRecipeToEdit] = useState<ObligatoryRecipe | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [obligatoryRecipes, setObligatoryRecipes] = useState<
    ObligatoryRecipe[]
  >(receivedObligatoryRecipes);

  const handleEditObligatoryRecipe = async (
    data: z.infer<typeof ObligatoryRecipeFormSchema>
  ) => {
    if (!recipeToEdit) return;
    console.log(data);
    const updateObligatoryRecipeDto: UpdateObligatoryRecipeDto = {
      id: recipeToEdit.id,
      name: data.name,
      amount: Number(data.amount),
      userId: user.id,
      date: new Date(data.date),
      recurrence: data.recurrence,
    };
    const response = await updateObligatoryRecipe(updateObligatoryRecipeDto);
    if (response.error) {
      console.error(response.error);
      return;
    }
    if (response.success) {
      setObligatoryRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === recipeToEdit.id ? response.data : recipe
        )
      );
      setIsEditDialogOpen(false);
    }
  };

  return (
    <section>
      <Table>
        <TableCaption>
          Vous pouvez modifier les recettes récurrentes en cliquant sur la ligne
          souhaitée.
        </TableCaption>
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
            <TableRow
              key={obligatory.id}
              className="cursor-pointer"
              onClick={() => {
                setRecipeToEdit(obligatory);
                setIsEditDialogOpen(!isEditDialogOpen);
              }}
            >
              <TableCell className="font-medium">{obligatory.name}</TableCell>
              <TableCell className="text-right">
                {obligatory.amount} €
              </TableCell>
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
                          Si vous archivez ce prélèvement, il ne sera plus pris
                          en compte dans le calcul de votre budget à partir de
                          la date de mise en archive.
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
      {recipeToEdit && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle>
                Vous souhaitez modifier cette recette récurrente (
                {recipeToEdit.name}) ?
              </DialogTitle>
              <DialogDescription>
                La modification de cette recette récurrente sera pris en compte
                instantanément.
              </DialogDescription>
              <section>
                <ObligatoryRecipeForm
                  userId={user.id}
                  onSubmit={handleEditObligatoryRecipe}
                  obligatoryRecipe={recipeToEdit}
                />
              </section>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};
