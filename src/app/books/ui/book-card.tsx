"use client";

import { SerializedBook } from "@/entities/book";
import { Book } from "@/generated/prisma/client";
import { format } from "date-fns";
import {
  Bookmark,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  LucideProps,
  Star,
  CalendarMinus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";

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
    status,
    title,
    totalPages,
  },
}: BookCardProps) => {
  const statusConfig: Record<
    Book["status"],
    {
      icon: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >;
      label: string;
      color: string;
      iconColor: string;
    }
  > = {
    READING: {
      icon: Clock,
      label: "Читаю",
      color: "bg-blue-100 text-blue-700",
      iconColor: "text-blue-600",
    },
    COMPLETED: {
      icon: CheckCircle2,
      label: "Прочитано",
      color: "bg-green-100 text-green-700",
      iconColor: "text-green-600",
    },
    PLANNED: {
      icon: Bookmark,
      label: "В планах",
      color: "bg-yellow-100 text-yellow-700",
      iconColor: "text-yellow-600",
    },
    DROPPED: {
      icon: CalendarMinus,
      label: "Брошено",
      color: "bg-red-100 text-red-700",
      iconColor: "text-red-600",
    },
  };

  const StatusIcon = statusConfig[status].icon;

  const progress =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <Link href={`/books/${id}`}>
      <div className="glass-morphism rounded-2xl p-4 card-hover cursor-pointer group">
        {/* Обложка */}
        <div className="aspect-[3/4] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-4 overflow-hidden relative">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-5xl">📖</span>
            </div>
          )}

          {/* Статус */}
          <span
            className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig[status].color}`}
          >
            <StatusIcon
              className={`w-3 h-3 ${statusConfig[status].iconColor}`}
            />
            {statusConfig[status].label}
          </span>
        </div>

        {/* Информация */}
        <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{author}</p>

        {/* Рейтинг и прогресс */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {rating}/5
            </span>
          </div>

          {status === "READING" && progress !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
          )}

          <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
