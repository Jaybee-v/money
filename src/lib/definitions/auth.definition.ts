import { JWTPayload } from "jose";
import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z.string().min(1, { message: "Votre prénom est requis" }),
  lastName: z.string().min(1, { message: "Votre nom est requis" }),
  email: z.string().email({ message: "Une adresse email valide est requise" }),
  password: z
    .string()

    .min(8, { message: "Au moins 8 caractères." })
    .regex(/[a-zA-Z]/, { message: "Contient au moins une lettre." })
    .regex(/[0-9]/, { message: "Contient au moins un chiffre." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contient au moins un caractère spécial.",
    })
    .trim(),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const SigninFormSchema = z.object({
  email: z.string().email({ message: "Une adresse email valide est requise" }),
  password: z.string(),
});

export const UpdateProfileFormSchema = z.object({
  name: z.string().min(1, { message: "Votre prénom est requis" }),
  email: z.string().email({ message: "Une adresse email valide est requise" }),
});

export interface SessionPayload extends JWTPayload {
  userId: string;
  expiresAt: Date;
}
