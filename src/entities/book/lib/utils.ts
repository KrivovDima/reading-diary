import { Book } from "@/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

export const getSerializedBook = <T extends { rating: Decimal | null }>(
  book: T,
) => ({
  ...book,
  rating: book.rating?.toString() ?? null,
});
