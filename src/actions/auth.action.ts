"use server";
import { CreateUserDto } from "@/lib/dtos/CreateUSerDto";
import { SigninDto } from "@/lib/dtos/SigninDto";
import { UpdatePasswordDto } from "@/lib/dtos/UpdatePasswordDto";
import { UpdateProfileDto } from "@/lib/dtos/UpdateProfileDto";
import { compare, hash } from "@/lib/hash";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

export const signup = async (createUserDto: CreateUserDto) => {
  const hashedPassword = await hash(createUserDto.password, 10);

  const user = await prisma.user.create({
    data: {
      ...createUserDto,
      password: hashedPassword,
    },
  });
  console.log(user);

  if (!user) {
    return { error: "User not created" };
  }

  await createSession(user.id);
};

export const signin = async (signinDto: SigninDto) => {
  const user = await prisma.user.findUnique({
    where: {
      email: signinDto.email,
    },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const isPasswordValid = await compare(signinDto.password, user.password);

  if (!isPasswordValid) {
    return { error: "Vos identifiants sont incorrects" };
  }

  await createSession(user.id);
};

export const updateProfile = async (updateProfileDto: UpdateProfileDto) => {
  const user = await prisma.user.update({
    where: {
      id: updateProfileDto.id,
    },
    data: {
      name: updateProfileDto.name,
      email: updateProfileDto.email,
    },
  });

  if (!user) {
    return { error: "User not found" };
  }

  return { success: "User updated" };
};

export const updatePassword = async (updatePasswordDto: UpdatePasswordDto) => {
  const user = await prisma.user.findUnique({
    where: {
      id: updatePasswordDto.id,
    },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const isPasswordValid = await compare(
    updatePasswordDto.oldPassword,
    user.password
  );

  if (!isPasswordValid) {
    return { error: "Mot de passe incorrect" };
  }

  if (updatePasswordDto.password !== updatePasswordDto.confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas" };
  }

  const hashedPassword = await hash(updatePasswordDto.password, 10);

  const response = await prisma.user.update({
    where: {
      id: updatePasswordDto.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  if (!response) {
    return { error: "Mot de passe non modifié" };
  }

  return { success: "Mot de passe modifié avec succès" };
};
