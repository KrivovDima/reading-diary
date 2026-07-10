import { auth } from "@/shared/lib/auth";
import { BooksList } from "./ui/books-list";
import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/db";
import { getSerializedBook } from "@/entities/book";

export default async function Books() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const books = await prisma.book.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
  const serializedBooks = books.map(getSerializedBook);

  return <BooksList books={serializedBooks} />;
}
