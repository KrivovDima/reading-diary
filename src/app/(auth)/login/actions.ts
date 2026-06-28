"use server";

import z from "zod";
import { loginSchema } from "./lib/validations";
import { signIn } from "@/shared/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { getZodErrorMessages } from "@/shared/utils";

export type LoginActionState =
  | {
      error?: string;
    }
  | undefined;

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  try {
    const validatedFields = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const { email, password } = validatedFields;

    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials" };
    }
    if (error instanceof z.ZodError) {
      return { error: getZodErrorMessages(error) };
    }

    return { error: "Something went wrong" };
  }

  redirect("/");
}
