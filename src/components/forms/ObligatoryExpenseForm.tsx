"use client";

import { ObligatoryExpenseFormSchema } from "@/lib/definitions/expense.definition";
import { zodResolver } from "@hookform/resolvers/zod";
import { ObligatoryExpense } from "@prisma/client";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const recurrenceOptions = [
  { value: "MONTHLY", label: "Tous les mois" },
  { value: "BIMONTHLY", label: "Tous les 2 mois" },
  { value: "QUARTERLY", label: "Tous les 3 mois" },
  { value: "BIANNUAL", label: "Tous les 6 mois" },
  { value: "ANNUAL", label: "Tous les ans" },
] as const;

interface ObligatoryExpenseFormProps {
  userId: string;
  onSubmit: (data: z.infer<typeof ObligatoryExpenseFormSchema>) => void;
  obligatoryExpense?: ObligatoryExpense;
}

export const ObligatoryExpenseForm = ({
  userId,
  onSubmit: onSubmitProp,
  obligatoryExpense,
}: ObligatoryExpenseFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof ObligatoryExpenseFormSchema>>({
    resolver: zodResolver(ObligatoryExpenseFormSchema),
    defaultValues: {
      name: obligatoryExpense?.name || "",
      amount: obligatoryExpense?.amount.toString() || "",
      userId: userId,
      startDate:
        obligatoryExpense?.startDate?.toISOString().split("T")[0] || "",
      recurrence: obligatoryExpense?.recurrence || "MONTHLY",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof ObligatoryExpenseFormSchema>
  ) => {
    setIsLoading(true);
    onSubmitProp(data);
    form.reset();
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du prélèvement</FormLabel>
              <FormDescription>Nommez votre prélèvement</FormDescription>
              <FormControl>
                <Input {...field} placeholder="Exemple : Loyer" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant</FormLabel>
              <FormDescription>Montant du prélèvement (en €)</FormDescription>
              <FormControl>
                <Input {...field} placeholder="Exemple : 500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date du prélèvement</FormLabel>
              <FormDescription>
                À quelle date ce prélèvement intervient-il ?
              </FormDescription>
              <FormControl>
                <DatePicker
                  selected={field.value ? field.value : undefined}
                  onSelect={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recurrence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fréquence</FormLabel>
              <FormDescription>
                À quelle fréquence ce prélèvement est-il effectué ?
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la fréquence" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {recurrenceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : obligatoryExpense ? (
              "Modifier"
            ) : (
              "Ajouter"
            )}
          </Button>
        </section>
      </form>
    </Form>
  );
};
