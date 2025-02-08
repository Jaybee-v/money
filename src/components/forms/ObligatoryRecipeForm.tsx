"use client";
import { ObligatoryRecipeFormSchema } from "@/lib/definitions/recipe.definition";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface ObligatoryRecipeFormProps {
  userId: string;
  onSubmit: (data: z.infer<typeof ObligatoryRecipeFormSchema>) => void;
}

export const ObligatoryRecipeForm = ({
  userId,
  onSubmit: onSubmitProp,
}: ObligatoryRecipeFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof ObligatoryRecipeFormSchema>>({
    resolver: zodResolver(ObligatoryRecipeFormSchema),
    defaultValues: {
      name: "",
      amount: "",
      userId: userId,
      date: "",
      recurrence: "MONTHLY",
    },
  });

  const onSubmit = async (data: z.infer<typeof ObligatoryRecipeFormSchema>) => {
    setIsLoading(true);
    console.log(data);
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
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de la rentrée</FormLabel>
              <FormDescription>
                À quelle date cette recette intervient-elle ?
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
                À quelle fréquence cette recette est-elle effectuée ?
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
            {isLoading ? <Loader className="animate-spin" /> : "Ajouter"}
          </Button>
        </section>
      </form>
    </Form>
  );
};
