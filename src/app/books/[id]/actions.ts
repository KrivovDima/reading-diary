"use server";

import { Book } from "@/generated/prisma/client";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/db";
import { getZodErrorMessages } from "@/shared/utils";
import { getBookFormValidatedFields } from "@/widgets/book-form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

export async function updateBookAction(bookId: string, formData: FormData) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { error: "Unauthorized" };
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId, userId: session.user.id },
    });

    if (!book) {
      return { error: "Book not found" };
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

    const getIsCompletedBook = () => {
      if (currentPage === totalPages) {
        return {
          status: "COMPLETED",
          endDate: new Date().toISOString(),
        } as const;
      }
    };

    await prisma.book.update({
      where: { id: book.id },
      data: {
        author,
        currentPage,
        status:
          status ?? (currentPage === totalPages ? "COMPLETED" : undefined),
        title,
        totalPages,
        coverUrl,
        endDate,
        rating,
        review,
        startDate,
        ...getIsCompletedBook(),
      },
    });

    revalidatePath("/books");
    revalidatePath(`/books/${bookId}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: getZodErrorMessages(error) };
    }

    return { error: "Failed to update book" };
  }
}

export async function deleteBookAction(id: string) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.book.delete({ where: { id, userId: session.user.id } });
  } catch (error) {
    return { error: "Faled to delete book" };
  }

  revalidatePath("/books");
  revalidatePath(`/books/${id}`);
  redirect("/books");
}
