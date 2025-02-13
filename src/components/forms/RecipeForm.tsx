"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RecipeFormSchema } from "@/lib/definitions/recipe.definition";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface RecipeFormProps {
  userId: string;
  onSubmit: (data: z.infer<typeof RecipeFormSchema>) => Promise<{
    success?: string;
    error?: string;
  }>;
}

export const RecipeForm = ({
  userId,
  onSubmit: onSubmitForm,
}: RecipeFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<z.infer<typeof RecipeFormSchema>>({
    resolver: zodResolver(RecipeFormSchema),
    defaultValues: {
      name: "",
      amount: "",
      date: "",
      userId: userId,
    },
  });

  const onSubmit = async (data: z.infer<typeof RecipeFormSchema>) => {
    const response = await onSubmitForm(data);
    if (response.success) {
      setSuccess(response.success);
      form.reset();
    }

    if (response.error) {
      setError(response.error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dénomination</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Exemple: Café" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Exemple: 1" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Date de la dépense</FormLabel>
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
        <section className="flex justify-end">
          <Button type="submit">Enregistrer</Button>
        </section>
      </form>
      {error && (
        <section>
          <Alert variant={"destructive"}>
            <Info className="h-4 w-4" />
            <AlertTitle>Erreur lors de la création de la recette</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </section>
      )}
      {success && (
        <section>
          {" "}
          <Alert variant={"success"} className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Recette enregistrée avec succès</AlertTitle>
            <AlertDescription>
              Vous pouvez enregistrer une nouvelle recette ou revenir au tableau
              de vos recettes
            </AlertDescription>
          </Alert>
        </section>
      )}
    </Form>
  );
};
