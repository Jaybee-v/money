"use client";
import {
  archiveObligatoryExpense,
  createObligatoryExpense,
  deleteObligatoryExpense,
  getObligatoryExpenses,
} from "@/actions/obligatoryExpense.action";
import { ObligatoryExpenseFormSchema } from "@/lib/definitions/expense.definition";
import { CreateObligatoryExpenseDto } from "@/lib/dtos/CreateObligatoryExpenseDto";
import { ObligatoryExpense, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ObligatoryExpenseForm } from "../forms/ObligatoryExpenseForm";
import { ObligatoryExpenseTable } from "../tables/ObligatoryExpenseTable";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ObligatoryExpensePageViewProps {
  user: User;
}

export const ObligatoryExpensePageView = ({
  user,
}: ObligatoryExpensePageViewProps) => {
  const [obligatoryExpenses, setObligatoryExpenses] = useState<
    ObligatoryExpense[]
  >([]);

  useEffect(() => {
    const fetchObligatoryExpenses = async () => {
      const response = await getObligatoryExpenses(user.id);
      if (response.error) {
        console.error(response.error);
      }
      if (response.obligatoryExpenses) {
        setObligatoryExpenses(response.obligatoryExpenses);
      }
    };
    fetchObligatoryExpenses();
  }, [user.id]);

  const onSubmit = async (
    data: z.infer<typeof ObligatoryExpenseFormSchema>
  ) => {
    console.log(data);
    const createObligatoryExpenseDto: CreateObligatoryExpenseDto = {
      name: data.name,
      amount: Number(data.amount),
      userId: data.userId,
      startDate: new Date(data.startDate),
      recurrence: data.recurrence,
    };
    const response = await createObligatoryExpense(createObligatoryExpenseDto);
    if (response.error) {
      console.error(response.error);
      return;
    }

    if (response.success) {
      console.log(response.success);
      setObligatoryExpenses((prev) => [...prev, response.data]);
    }
  };

  const onDelete = async (expenseId: string) => {
    const response = await deleteObligatoryExpense(expenseId);
    console.log(response);
    if (response.error) {
      console.error(response.error);
    }
    if (response.success) {
      console.log(response.success);
      setObligatoryExpenses((prev) =>
        prev.filter((expense) => expense.id !== expenseId)
      );
    }
  };

  const onArchive = async (expenseId: string) => {
    const response = await archiveObligatoryExpense(expenseId);
    console.log(response);
    if (response.error) {
      console.error(response.error);
    }
    if (response.success) {
      console.log(response.success);

      const reload = await getObligatoryExpenses(user.id);
      if (reload.error) {
        console.error(reload.error);
      }
      if (reload.obligatoryExpenses) {
        setObligatoryExpenses(reload.obligatoryExpenses);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">
        Gérez vos prélèvements récurrents
      </h1>
      <p className="text-sm text-center text-muted-foreground">
        Vous pouvez ajouter des dépenses récurrentes pour vous aider à gérer
        votre budget.
      </p>
      <section className="flex max-md:flex-col justify-evenly">
        <Card className="max-w-sm mx-auto">
          <CardHeader>
            <CardTitle>Ajouter un prélèvement récurrent</CardTitle>
          </CardHeader>
          <CardContent>
            <ObligatoryExpenseForm userId={user.id} onSubmit={onSubmit} />
          </CardContent>
        </Card>
        <section className="mt-4 w-full max-w-4xl mx-auto space-y-4">
          {obligatoryExpenses.length > 0 ? (
            <ObligatoryExpenseTable
              obligatoryExpenses={obligatoryExpenses}
              onDelete={onDelete}
              onArchive={onArchive}
            />
          ) : (
            <p className="text-center text-sm text-muted-foreground my-12">
              Aucun prélèvement récurrent renseigné
            </p>
          )}
        </section>
      </section>
    </div>
  );
};
