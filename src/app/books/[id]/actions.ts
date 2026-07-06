"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/db";
import { getZodErrorMessages } from "@/shared/utils";
import { getBookFormValidatedFields } from "@/widgets/book-form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { noteSchema } from "./lib/validations";
import { uploadBookCover } from "@/features/uploadBookCover";

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

    const file = formData.get("cover") as File | undefined;
    const coverUrl = file ? await uploadBookCover(file) : undefined;

    const getIsCompletedBook = () => {
      if (validatedFields.currentPage === validatedFields.totalPages) {
        return {
          status: "COMPLETED",
          endDate: new Date().toISOString(),
        } as const;
      }
    };

    await prisma.book.update({
      where: { id: book.id },
      data: {
        ...validatedFields,
        ...(coverUrl && { coverUrl }),
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

export async function updateCurrentPageAction({
  bookId,
  page,
}: {
  page: number;
  bookId: string;
}) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    const userId = session.user.id;
    const book = await prisma.book.findUnique({
      where: { id: bookId, userId },
    });

    if (!book) {
      return { error: "Book not found" };
    }

    if (page < 0 || page > book.totalPages) {
      return { error: "Not valid current page" };
    }

    await prisma.book.update({
      where: { id: bookId, userId },
      data: {
        currentPage: page,
        status: page === book.totalPages ? "COMPLETED" : undefined,
      },
    });
  } catch (error) {
    return { error: "Faled to update current page" };
  }

  revalidatePath(`books/${bookId}`);
  revalidatePath("books");
}

export type AddNoteActionState = { error?: string } | undefined;
export async function addNoteAction(formData: FormData, bookId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorize" };
  }

  try {
    const validatedFields = noteSchema.parse({
      content: formData.get("noteContent"),
      page: Number(formData.get("notePage")) || undefined,
    });
    const { content, page } = validatedFields;

    const userId = session.user.id;
    const book = await prisma.book.findUnique({
      where: { id: bookId, userId },
    });

    if (!book) {
      return { error: "Not fount book" };
    }

    await prisma.note.create({ data: { content, page, bookId, userId } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: getZodErrorMessages(error) };
    }

    return { error: "Faled to add note" };
  }

  revalidatePath(`books/${bookId}`);
}

export async function deleteNoteAction({
  bookId,
  noteId,
}: {
  noteId: string;
  bookId: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorize" };
  }

  try {
    await prisma.note.delete({
      where: { id: noteId, userId: session.user.id },
    });
  } catch (error) {
    return { error: "Faled to delete note" };
  }
  revalidatePath(`books/${bookId}`);
}
