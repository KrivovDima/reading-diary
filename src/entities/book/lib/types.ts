import { Book } from "@/generated/prisma/client";

export type SerializedBook = Omit<Book, "rating"> & { rating: string | null };
