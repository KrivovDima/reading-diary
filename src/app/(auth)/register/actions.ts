"use server";

import { prisma } from "@/shared/lib/db";
import { registerShema } from "./lib/validations";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { LOGIN_URL } from "./lib/constants";
import z from "zod";

export type RegisterAction = { error?: string };

export async function registerAction(
  _prevState: RegisterAction,
  formData: FormData,
): Promise<RegisterAction> {
  try {
    const validatedFields = registerShema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const { email, name, password } = validatedFields;
    console.log(validatedFields);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return { error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = JSON.parse(error.message) as { message: string }[];
      return { error: errorMessages.map(({ message }) => message).join(". ") };
    }

    return { error: "Something went wrong" };
  }

  redirect(LOGIN_URL);
}
