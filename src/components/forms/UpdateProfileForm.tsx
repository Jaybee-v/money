"use client";

import { updateProfile } from "@/actions/auth.action";
import { UpdateProfileFormSchema } from "@/lib/definitions/auth.definition";
import { UpdateProfileDto } from "@/lib/dtos/UpdateProfileDto";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

interface UpdateProfileFormProps {
  user: User;
  setIsUpdateMode: (isUpdateMode: boolean) => void;
  setUser: (user: User) => void;
}

export const UpdateProfileForm = ({
  user,
  setIsUpdateMode,
  setUser,
}: UpdateProfileFormProps) => {
  const form = useForm<z.infer<typeof UpdateProfileFormSchema>>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = async (values: z.infer<typeof UpdateProfileFormSchema>) => {
    console.log(values);
    const updateProfileDto: UpdateProfileDto = {
      id: user.id,
      name: values.name,
      email: values.email,
    };

    const response = await updateProfile(updateProfileDto);

    if (response.error) {
      console.error(response.error);
      return;
    }

    setUser({ ...user, name: values.name, email: values.email });
    setIsUpdateMode(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <section className="flex justify-end">
          <Button type="submit">Mettre à jour</Button>
        </section>
      </form>
    </Form>
  );
};
