"use server";
import { CreateUserDto } from "@/lib/dtos/CreateUSerDto";
import { SigninDto } from "@/lib/dtos/SigninDto";
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
