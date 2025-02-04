"use client";

import { logout } from "@/lib/session";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export const LogoutButton = () => {
  return (
    <Button
      onClick={() => {
        logout();
      }}
      variant={"outline"}
      size="sm"
      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-full mt-2"
    >
      <LogOut />
      <span>Déconnexion</span>
    </Button>
  );
};
