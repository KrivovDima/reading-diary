"use server";

import { signOut } from "@/shared/lib/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await signOut();
  redirect("/login");
}
