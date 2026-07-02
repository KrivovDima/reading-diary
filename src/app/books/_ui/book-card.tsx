"use client";

import { SerializedBook } from "@/entities/book";
import { Book } from "@/generated/prisma/client";
import { format } from "date-fns";
import { BookOpen, Calendar, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BookCardProps = {
  book: SerializedBook;
};

export const BookCard = ({
  book: {
    id,
    author,
    coverUrl,
    currentPage,
    rating,
    startDate,
    status,
    title,
    totalPages,
  },
}: BookCardProps) => {
  const statusColors: Record<Book["status"], string> = {
    READING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    PLANNED: "bg-yellow-100 text-yellow-800",
    DROPPED: "bg-red-100 text-red-800",
  };

  const progress =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <Link href={`/books/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 bg-gray-200">
          {false ? (
            <Image
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
              width={100}
              height={100}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <span
            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
              statusColors[status]
            }`}
          >
            {status}
          </span>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{author}</p>

          {status === "READING" && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            {rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1">{String(rating)}/5</span>
              </div>
            )}
            {startDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{format(new Date(startDate), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
