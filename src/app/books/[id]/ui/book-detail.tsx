"use client";

import { Prisma } from "@/generated/prisma/client";
import { BookForm } from "@/widgets/book-form";
import { format } from "date-fns";
import {
  AlertTriangle,
  Bookmark,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Edit2,
  Edit3,
  Hash,
  Loader2,
  MessageSquare,
  Minus,
  Plus,
  SquarePen,
  Star,
  StickyNote,
  Trash2,
  TrendingUp,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useActionState, useState } from "react";
import {
  addNoteAction,
  AddNoteActionState,
  deleteBookAction,
  deleteNoteAction,
  updateBookAction,
  updateCurrentPageAction,
} from "../actions";
import toast from "react-hot-toast";
import Link from "next/link";
import { statusConfig } from "@/entities/book";
import { ReviewForm } from "./review-form";

type UpdateBookActionState = { error?: string } | undefined;
type BookDetailProps = {
  book: Prisma.BookGetPayload<{ include: { notes: true } }>;
};

export const BookDetail = ({
  book,
  book: {
    id,
    author,
    coverUrl,
    currentPage,
    totalPages,
    title,
    notes,
    rating,
    review,
    startDate,
    endDate,
    status,
  },
}: BookDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const tabs = [
    { key: "info", label: "Информация", icon: BookOpen },
    { key: "reviews", label: "Отзывы", icon: MessageSquare },
    { key: "notes", label: "Заметки", icon: StickyNote },
  ];

  const handleAddNote = async (
    _prevState: AddNoteActionState,
    formData: FormData,
  ) => {
    const result = await addNoteAction(formData, id);

    if (result?.error) {
      toast.error(result.error);
    }

    return result;
  };

  const [, addNote] = useActionState<AddNoteActionState, FormData>(
    handleAddNote,
    undefined,
  );

  const progress =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  const handleDeleteBook = async () => {
    const result = await deleteBookAction(id);

    if (result.error) {
      toast.error(result.error);
    }
  };

  const handleUpdateCurrentPage = async (page: number) => {
    const result = await updateCurrentPageAction({ page, bookId: id });

    if (result?.error) {
      toast.error(result.error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const result = await deleteNoteAction({ bookId: id, noteId });

    if (result?.error) {
      toast.error(result.error);
    }
  };

  const handleUpdateBook = async (
    _prevState: UpdateBookActionState,
    formData: FormData,
  ) => {
    const data = await updateBookAction(id, formData);

    setIsEditing(false);

    return data;
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-8 flex items-center gap-3">
          <SquarePen className="w-8 h-8 sm:w-10 sm:h-10" />
          Изменить данные книги
        </h1>
        <BookForm
          action={handleUpdateBook}
          initialActionState={undefined}
          initialFormState={book}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const StatusIcon = statusConfig[status].icon;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {/* Кнопка назад */}
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Назад к списку</span>
        </Link>

        {/* Верхняя секция */}
        <div className="glass-morphism rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-48 h-64 flex-shrink-0 relative group">
              {coverUrl ? (
                // Если есть обложка, показываем изображение
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src={coverUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // Если обложки нет, показываем плейсхолдер
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                  <BookOpen className="w-20 h-20 text-white/30" />
                  <span className="text-white/50 text-sm mt-2">
                    Нет обложки
                  </span>
                </div>
              )}

              {/* Статус на обложке */}
              <span
                className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${statusConfig[status].color}`}
              >
                <StatusIcon
                  className={`w-3 h-3 ${statusConfig[status].iconColor}`}
                />
                {statusConfig[status].label}
              </span>
            </div>

            {/* Информация */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
                    {title}
                  </h1>
                  <p className="text-gray-600 text-lg">{author}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-lg">{String(rating)}</span>
                </div>
              </div>

              {/* Прогресс чтения */}
              <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-indigo-700">
                      {status === "COMPLETED" ? "Прочитано" : "Прогресс чтения"}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">
                    {book.currentPage} из {totalPages} стр.
                  </span>
                </div>

                {/* Прогресс-бар */}
                <div className="relative">
                  <div className="w-full h-4 bg-indigo-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ${
                        progress === 100 ? "from-green-500 to-emerald-500" : ""
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="absolute right-0 -top-1 text-xs font-bold text-indigo-600">
                    {progress}%
                  </span>
                </div>

                {/* Управление страницами */}
                {status !== "COMPLETED" && (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={() => handleUpdateCurrentPage(currentPage - 1)}
                      disabled={currentPage <= 0}
                      className="w-10 h-10 rounded-xl bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Уменьшить страницу"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border-2 border-indigo-100">
                      <span className="text-2xl font-bold text-indigo-600 min-w-[3ch] text-center">
                        {currentPage}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-600">{totalPages}</span>
                    </div>

                    <button
                      onClick={() => handleUpdateCurrentPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="w-10 h-10 rounded-xl bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Увеличить страницу"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Кнопка "Прочитано" */}
                {status === "READING" && currentPage < totalPages && (
                  <button
                    onClick={() => handleUpdateCurrentPage(totalPages)}
                    className="w-full mt-3 px-4 py-2.5 rounded-xl bg-green-50 text-green-700 font-medium hover:bg-green-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Отметить как прочитанное
                  </button>
                )}

                {/* Статус "Прочитано" */}
                {status === "COMPLETED" && (
                  <div className="flex items-center justify-center gap-2 mt-3 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Книга прочитана! 🎉</span>
                  </div>
                )}
              </div>

              {/* Мета-информация */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-xs text-gray-500 block">Жанр</span>
                    <p className="font-medium text-sm"></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Год издания
                    </span>
                    <p className="font-medium text-sm"></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-xs text-gray-500 block">Страниц</span>
                    <p className="font-medium text-sm">{totalPages}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon
                    className={`w-4 h-4 ${statusConfig[status].iconColor}`}
                  />
                  <div>
                    <span className="text-xs text-gray-500 block">Статус</span>
                    <p className="font-medium text-sm">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusConfig[status].color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[status].label}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex-1"
                >
                  <Edit3 className="w-4 h-4" />
                  Изменить
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-3 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all hover:border-red-300"
                  aria-label="Удалить книгу"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="glass-morphism rounded-3xl p-6 sm:p-8">
          <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 pb-3 px-2 transition-all duration-200 relative whitespace-nowrap ${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Содержимое табов */}
          {activeTab === "info" && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />О книге
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed"></p>
              </div>

              {/* Дополнительная информация */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Статистика чтения
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Прогресс</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Прочитано страниц</span>
                      <span className="font-medium">{currentPage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Осталось страниц</span>
                      <span className="font-medium">
                        {totalPages - currentPage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Рейтинг и отзывы
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Средний рейтинг</span>
                      <span className="font-medium flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        {String(rating)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Отзыв
              </h3>

              <ReviewForm bookId={id} />

              {review && (
                <div className="space-y-4 mt-6">
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Number(rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-indigo-600" />
                Мои заметки
              </h3>
              <form action={addNote}>
                <textarea
                  className="input-field min-h-[200px] resize-y"
                  placeholder="Записывайте свои мысли, цитаты и впечатления о книге..."
                  name="noteContent"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    Страница
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="0"
                    name="notePage"
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-400">
                    Последнее изменение: 15 марта 2024
                  </span>
                  <button type="submit" className="btn-primary w-auto">
                    <StickyNote className="w-4 h-4" />
                    Сохранить заметку
                  </button>
                </div>
              </form>
              <div className="space-y-4 mt-3">
                {notes.length === 0 ? (
                  <div className="text-center py-8">
                    <StickyNote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">У вас пока нет заметок</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Добавьте первую заметку, чтобы сохранить свои мысли о
                      книге
                    </p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {note.content}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                              <BookMarked className="w-3.5 h-3.5" />
                              Стр. {note.page}
                            </span>
                            <span className="text-xs text-gray-400">
                              {format(new Date(note.createdAt), "dd.MM.yyyy")}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                          aria-label="Удалить заметку"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBook}
        bookTitle={book.title}
      />
    </>
  );
};

// Компонент модального окна подтверждения удаления
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  bookTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Удалить книгу?
        </h3>
        <p className="text-gray-600 text-center mb-2">
          Вы действительно хотите удалить книгу:
        </p>
        <p className="text-gray-900 font-semibold text-center mb-6">
          &ldquo;{bookTitle}&rdquo;
        </p>
        <p className="text-sm text-gray-500 text-center mb-6 bg-amber-50 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-600" />
          Это действие нельзя будет отменить. Все заметки и отзывы будут
          удалены.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
