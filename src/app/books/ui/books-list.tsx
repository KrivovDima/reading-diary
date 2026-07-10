"use client";

import { Book } from "@/generated/prisma/client";
import {
  Bookmark,
  BookOpen,
  CalendarMinus,
  CheckCircle2,
  Clock,
  Grid3X3,
  List,
  Search,
} from "lucide-react";
import { useState } from "react";
import { BookCard } from "./book-card";
import { SerializedBook } from "@/entities/book";

type BooksListProps = {
  books: Array<SerializedBook>;
};

export const BooksList = ({ books }: BooksListProps) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filters = [
    { key: "all", label: "Все", icon: BookOpen },
    { key: "READING", label: "Читаю", icon: Clock },
    { key: "COMPLETED", label: "Прочитано", icon: CheckCircle2 },
    { key: "PLANNED", label: "В планах", icon: Bookmark },
    { key: "DROPPED", label: "Брошено", icon: CalendarMinus },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesFilter = filter === "all" || book.status === filter;
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Заголовок и управление */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center gap-3">
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />
          Мои книги
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск книг по названию или автору..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12 pr-4"
          />
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((f) => {
          const Icon = f.icon;
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 font-medium ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-indigo-600" : ""}`}
              />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Список книг */}
      {filteredBooks.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
              : "space-y-4"
          }
        >
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Книги не найдены
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Попробуйте изменить параметры поиска"
              : "Добавьте свою первую книгу!"}
          </p>
        </div>
      )}
    </div>
  );
};
