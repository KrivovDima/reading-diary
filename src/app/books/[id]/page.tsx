import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/db";
import { notFound, redirect } from "next/navigation";
import { BookDetail } from "./_ui/book-detail";
import { getSerializedBook } from "@/entities/book";

type BookProps = {
  params: Promise<{ id: string }>;
};

export default async function Book({ params }: BookProps) {
  const session = await auth();
  const { id: bookId } = await params;

  if (!session?.user) {
    redirect("/login");
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId, userId: session.user.id },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  });

  if (!book) {
    notFound();
  }

  return <BookDetail book={getSerializedBook(book)} />;
}
