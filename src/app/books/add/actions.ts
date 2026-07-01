"use server";

import { prisma } from "@/shared/lib/db";
import { auth } from "@/shared/lib/auth";
import { revalidatePath } from "next/cache";
import z from "zod";
import { redirect } from "next/navigation";
import { getZodErrorMessages } from "@/shared/utils";
import { getBookFormValidatedFields } from "@/widgets/book-form";

export type AddBookActionState = { error?: string } | undefined;

export async function addBookAction(
  _prevState: AddBookActionState,
  formData: FormData,
): Promise<AddBookActionState> {
  let newBookId: string | null = null;

  try {
    const session = await auth();

    if (!session || !session.user) {
      return { error: "Unauthorized" };
    }

    const validatedFields = getBookFormValidatedFields(formData);

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
