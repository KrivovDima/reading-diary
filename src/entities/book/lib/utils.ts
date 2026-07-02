import { Book } from "@/generated/prisma/client";

export const getSerializedBook = (book: Book) => ({
  ...book,
  rating: book.rating?.toString() ?? null,
});
