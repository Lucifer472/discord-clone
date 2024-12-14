"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";

import { signIn } from "@/auth";
import { db } from "@/lib/db";

import { LoginSchema, RegisterSchema } from "./schema";

import { getUserByEmail } from "@/data/user";

export const Login = async (v: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(v);

  if (!validatedFields.success) {
    return { error: validatedFields.error.message };
  }

  const { email, password } = validatedFields.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return { error: "No User Found!" };
  }

  if (!user.password) {
    return { error: "Please Use Oath Providers Like Google or Github" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: "Request was success" };
  } catch {
    return { error: "Email or Password is Wrong!" };
  }
};

export const Register = async (v: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(v);

  if (!validatedFields.success) {
    return { error: validatedFields.error.message };
  }

  const { email, password, name } = validatedFields.data;

  const user = await getUserByEmail(email);

  if (user) {
    return { error: "User Already Exists!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: "Request was success" };
  } catch {
    return { error: "Email or Password is Wrong!" };
  }
};
