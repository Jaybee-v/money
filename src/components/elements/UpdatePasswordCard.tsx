"use client";
import { User } from "@prisma/client";
import { UpdatePasswordForm } from "../forms/UpdatePasswordForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface UpdatePasswordCardProps {
  user: User;
}

export const UpdatePasswordCard = ({ user }: UpdatePasswordCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifier mon mot de passe</CardTitle>
      </CardHeader>
      <CardContent>
        <UpdatePasswordForm user={user} />
      </CardContent>
    </Card>
  );
};
