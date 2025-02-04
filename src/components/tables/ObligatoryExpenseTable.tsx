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
import { ObligatoryExpense } from "@prisma/client";
import { ArchiveRestore, Check, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface ObligatoryExpenseTableProps {
  obligatoryExpenses: ObligatoryExpense[];
  onDelete: (expenseId: string) => void;
  onArchive: (expenseId: string) => void;
}

export const ObligatoryExpenseTable = ({
  obligatoryExpenses,
  onDelete,
  onArchive,
}: ObligatoryExpenseTableProps) => {
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [expenseToArchive, setExpenseToArchive] = useState<string | null>(null);

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
        {obligatoryExpenses.map((obligatory) => (
          <TableRow key={obligatory.id}>
            <TableCell className="font-medium">{obligatory.name}</TableCell>
            <TableCell className="text-right">{obligatory.amount} €</TableCell>
            <TableCell className="text-right">
              {new Date(obligatory.startDate).getDate()} du mois
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
  );
};
