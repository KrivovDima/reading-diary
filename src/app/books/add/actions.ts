"use server";

import { prisma } from "@/shared/lib/db";
import { addBookShema } from "./lib/validations";
import { auth } from "@/shared/lib/auth";
import { revalidatePath } from "next/cache";
import z from "zod";
import { redirect } from "next/navigation";
import { getZodErrorMessages } from "@/shared/utils";

export type AddBookActionState = { error?: string } | undefined;

export async function addBookAction(
  _prevState: AddBookActionState,
  formData: FormData,
): Promise<AddBookActionState> {
  let newBookId: string | null = null;

  try {
    const ratingValue = formData.get("rating");
    const startDateValue = formData.get("startDate") as string;
    const endDateValue = formData.get("endDate") as string;
    const validatedFields = addBookShema.parse({
      title: formData.get("title"),
      author: formData.get("author"),
      coverUrl: formData.get("coverUrl"),
      totalPages: Number(formData.get("totalPages")),
      currentPage: Number(formData.get("currentPage")) || undefined,
      status: formData.get("status"),
      rating: ratingValue === "" ? undefined : Number(ratingValue),
      startDate: startDateValue
        ? new Date(startDateValue).toISOString()
        : undefined,
      endDate: endDateValue ? new Date(endDateValue).toISOString() : undefined,
      review: formData.get("review") || undefined,
    });
    const session = await auth();

    if (!session || !session.user) {
      return { error: "Unauthorized" };
    }

    const {
      author,
      currentPage,
      status,
      title,
      totalPages,
      coverUrl,
      endDate,
      rating,
      review,
      startDate,
    } = validatedFields;

    const book = await prisma.book.create({
      data: {
        title,
        author,
        coverUrl: coverUrl || undefined,
        totalPages,
        currentPage,
        status,
        rating,
        startDate,
        endDate,
        review,
        userId: session.user.id!,
      },
    });
    newBookId = book.id;

    revalidatePath("/books");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: getZodErrorMessages(error) };
    }

    return { error: `Failed to add book: ${JSON.stringify(error)}` };
  }

  redirect(`${newBookId}`);
}
