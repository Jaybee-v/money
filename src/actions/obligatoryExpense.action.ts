"use server";

import { CreateObligatoryExpenseDto } from "@/lib/dtos/CreateObligatoryExpenseDto";
import { UpdateObligatoryExpenseDto } from "@/lib/dtos/UpdateObligatoryExpenseDto";
import prisma from "@/lib/prisma";

export const createObligatoryExpense = async (
  expense: CreateObligatoryExpenseDto
) => {
  const _expense = await prisma.obligatoryExpense.create({
    data: expense,
  });

  if (!_expense) {
    return { error: "Erreur lors de la création du prélèvement obligatoire" };
  }

  return {
    success: "Prélèvement obligatoire créé avec succès",
    data: _expense,
  };
};

export const getObligatoryExpenses = async (userId: string) => {
  const _obligatoryExpenses = await prisma.obligatoryExpense.findMany({
    where: { userId },
  });

  if (!_obligatoryExpenses) {
    return {
      error: "Erreur lors de la récupération des prélèvements obligatoires",
    };
  }

  return { obligatoryExpenses: _obligatoryExpenses };
};

export const updateObligatoryExpense = async (
  expense: UpdateObligatoryExpenseDto
) => {
  const _expense = await prisma.obligatoryExpense.update({
    where: { id: expense.id },
    data: expense,
  });

  if (!_expense) {
    return {
      error: "Erreur lors de la modification du prélèvement obligatoire",
    };
  }

  return {
    success: "Prélèvement obligatoire modifié avec succès",
    data: _expense,
  };
};

export const archiveObligatoryExpense = async (expenseId: string) => {
  const _expense = await prisma.obligatoryExpense.update({
    where: { id: expenseId },
    data: { isArchived: true, archivedAt: new Date() },
  });

  if (!_expense) {
    return {
      error: "Erreur lors de l'archivage du prélèvement obligatoire",
    };
  }

  return { success: "Prélèvement obligatoire archivé avec succès" };
};

export const deleteObligatoryExpense = async (expenseId: string) => {
  const _expense = await prisma.obligatoryExpense.delete({
    where: { id: expenseId },
  });

  if (!_expense) {
    return {
      error: "Erreur lors de la suppression du prélèvement obligatoire",
    };
  }

  return { success: "Prélèvement obligatoire supprimé avec succès" };
};
