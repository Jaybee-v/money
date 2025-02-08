"use client";

import { UpdatePasswordFormSchema } from "@/lib/definitions/auth.definition";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updatePassword } from "@/actions/auth.action";
import { UpdatePasswordDto } from "@/lib/dtos/UpdatePasswordDto";
import { User } from "@prisma/client";
import { Info } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
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

interface UpdatePasswordFormProps {
  user: User;
}

export const UpdatePasswordForm = ({ user }: UpdatePasswordFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<z.infer<typeof UpdatePasswordFormSchema>>({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdatePasswordFormSchema>) => {
    console.log(values);
    const updatePasswordDto: UpdatePasswordDto = {
      id: user.id,
      oldPassword: values.oldPassword,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    const response = await updatePassword(updatePasswordDto);

    if (response.error) {
      setError(response.error);
    }

    if (response.success) {
      setSuccess(response.success);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                Veuillez entrer votre mot de passe actuel.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                Veuillez entrer votre nouveau mot de passe.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                Veuillez confirmer votre nouveau mot de passe.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="flex justify-end">
          <Button type="submit">Mettre à jour</Button>
        </section>
      </form>
      {error && (
        <section>
          <Alert variant={"destructive"}>
            <Info className="h-4 w-4" />
            <AlertTitle>
              Erreur lors de la modification du mot de passe
            </AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </section>
      )}
      {success && (
        <section>
          {" "}
          <Alert variant={"success"} className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Modification enregistrée</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        </section>
      )}
    </Form>
  );
};
