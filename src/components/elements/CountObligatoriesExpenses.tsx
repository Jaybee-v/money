"use client";

import { getObligatoryExpenses } from "@/actions/obligatoryExpense.action";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CountObligatoriesExpensesProps {
  userId: string;
}

export const CountObligatoriesExpenses = ({
  userId,
}: CountObligatoriesExpensesProps) => {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const calculateAmount = async () => {
      const response = await getObligatoryExpenses(userId);
      if (response.error) {
        console.error(response.error);
      }
      if (response.obligatoryExpenses) {
        setAmount(
          response.obligatoryExpenses.reduce(
            (acc, expense) => acc + expense.amount,
            0
          )
        );
      }
    };
    calculateAmount();
  }, [userId]);

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Vos prélèvements mensuels</CardTitle>
        <CardDescription>
          Vous avez <span className="font-bold">{amount} € </span>
          de prélèvements mensuels récurrents.
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-end">
        <Link
          href="/app/obligatory-expenses"
          className="text-sm border py-1 px-4 rounded-md hover:bg-gray-50"
        >
          Voir vos prélèvements récurrents
        </Link>
      </CardFooter>
    </Card>
  );
};
