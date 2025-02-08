"use client";

import { User } from "@prisma/client";
import { useState } from "react";
import { UpdateProfileForm } from "../forms/UpdateProfileForm";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface UpdateProfileCardProps {
  user: User;
}

export const UpdateProfileCard = ({
  user: receivedUser,
}: UpdateProfileCardProps) => {
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [user, setUser] = useState<User>(receivedUser);

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Mes informations</CardTitle>
      </CardHeader>

      <CardContent>
        {!isUpdateMode ? (
          <section className="space-y-2">
            <p>Nom: {user.name}</p>
            <p>Email: {user.email}</p>
          </section>
        ) : (
          <UpdateProfileForm
            user={user}
            setIsUpdateMode={setIsUpdateMode}
            setUser={setUser}
          />
        )}
      </CardContent>
      {!isUpdateMode && (
        <CardFooter className="flex justify-end">
          <Button type="button" onClick={() => setIsUpdateMode(!isUpdateMode)}>
            Modifier mes informations
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
