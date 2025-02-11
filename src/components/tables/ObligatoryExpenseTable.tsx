import { updateObligatoryExpense } from "@/actions/obligatoryExpense.action";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ObligatoryExpenseFormSchema } from "@/lib/definitions/expense.definition";
import { UpdateObligatoryExpenseDto } from "@/lib/dtos/UpdateObligatoryExpenseDto";
import { ObligatoryExpense, User } from "@prisma/client";
import { ArchiveRestore, Check, Trash } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { ObligatoryExpenseForm } from "../forms/ObligatoryExpenseForm";
import { Button } from "../ui/button";

interface ObligatoryExpenseTableProps {
  obligatoryExpenses: ObligatoryExpense[];
  onDelete: (expenseId: string) => void;
  onArchive: (expenseId: string) => void;
  user: User;
}

export const ObligatoryExpenseTable = ({
  obligatoryExpenses: receivedObligatoryExpenses,
  onDelete,
  onArchive,
  user,
}: ObligatoryExpenseTableProps) => {
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [expenseToArchive, setExpenseToArchive] = useState<string | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<ObligatoryExpense | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [obligatoryExpenses, setObligatoryExpenses] = useState<
    ObligatoryExpense[]
  >(receivedObligatoryExpenses);

  const handleEditObligatoryExpense = async (
    data: z.infer<typeof ObligatoryExpenseFormSchema>
  ) => {
    if (!expenseToEdit) return;
    console.log(data);
    const updateObligatoryExpenseDto: UpdateObligatoryExpenseDto = {
      id: expenseToEdit.id,
      name: data.name,
      amount: Number(data.amount),
      userId: data.userId,
      startDate: new Date(data.startDate),
      recurrence: data.recurrence,
    };
    const response = await updateObligatoryExpense(updateObligatoryExpenseDto);
    if (response.error) {
      console.error(response.error);
      return;
    }

    if (response.success) {
      console.log(response.success);
      setObligatoryExpenses((prev) =>
        prev.map((expense) =>
          expense.id === expenseToEdit.id ? response.data : expense
        )
      );
      setIsEditDialogOpen(false);
    }
  };

  return (
    <section>
      <Table>
        <TableCaption>
          Vous pouvez modifier les prélèvements récurrents en cliquant sur la
          ligne souhaitée.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Dénomination</TableHead>
            <TableHead className="text-right">Montant (en €)</TableHead>
            <TableHead className="text-right max-lg:hidden">
              Date de prélèvement
            </TableHead>
            <TableHead className="text-right  max-lg:hidden">
              Récurrence
            </TableHead>
            <TableHead className="text-center  max-lg:hidden">
              Archivée
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {obligatoryExpenses.map((obligatory) => (
            <TableRow
              key={obligatory.id}
              className="cursor-pointer"
              onClick={() => {
                setExpenseToEdit(obligatory);
                setIsEditDialogOpen(!isEditDialogOpen);
              }}
            >
              <TableCell className="font-medium">{obligatory.name}</TableCell>
              <TableCell className="text-right">
                {obligatory.amount} €
              </TableCell>
              <TableCell className="text-right  max-lg:hidden">
                {new Date(obligatory.startDate).getDate()} du mois
              </TableCell>
              <TableCell className="text-right  max-lg:hidden">
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
              <TableCell className="flex justify-center  max-lg:hidden">
                {obligatory.isArchived ? (
                  <Check className="text-amber-600" />
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell className="text-right">
                {!obligatory.isArchived && (
                  <AlertDialog
                    open={expenseToArchive === obligatory.id}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) setExpenseToArchive(null);
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-amber-600 hover:text-amber-600 hover:bg-amber-600/10"
                      onClick={() => setExpenseToArchive(obligatory.id)}
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
                            if (expenseToArchive) {
                              onArchive(expenseToArchive);
                              setExpenseToArchive(null);
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
                  open={expenseToDelete === obligatory.id}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) setExpenseToDelete(null);
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-600 hover:bg-red-600/10"
                    onClick={() => setExpenseToDelete(obligatory.id)}
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
                          if (expenseToDelete) {
                            onDelete(expenseToDelete);
                            setExpenseToDelete(null);
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
      {expenseToEdit && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle>
                Vous souhaitez modifier ce prélèvement récurrent (
                {expenseToEdit.name}) ?
              </DialogTitle>
              <DialogDescription>
                La modification de ce prélèvement récurrent sera pris en compte
                instantanément.
              </DialogDescription>
              <section>
                <ObligatoryExpenseForm
                  userId={user.id}
                  onSubmit={handleEditObligatoryExpense}
                  obligatoryExpense={expenseToEdit}
                />
              </section>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};
