"use client";

import { Book } from "@/generated/prisma/client";
import { Search } from "lucide-react";
import { useState } from "react";
import { BookCard } from "./book-card";

type BooksListProps = {
  books: Book[];
};

export const BooksList = ({ books }: BooksListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // TODO:
  const filteredBooks = books;

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex space-x-2">
          {["all", "reading", "completed", "planned", "dropped"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {filteredBooks && filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book: Book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {books && books.length > 0
              ? "No books found matching your search."
              : "No books yet. Start your reading journey!"}
          </p>
        </div>
      )}
    </>
  );
};
