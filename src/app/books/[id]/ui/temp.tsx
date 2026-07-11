// app/books/[id]/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Hash,
  Edit3,
  Trash2,
  MessageSquare,
  StickyNote,
  Star,
  TrendingUp,
  Clock,
  Bookmark,
  ChevronLeft,
  User,
  Plus,
  Minus,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  XCircle,
  Upload,
  Save,
  BookMarked,
} from "lucide-react";
import ReviewForm from "../../components/ReviewForm";

// Типы данных
interface Note {
  id: number;
  text: string;
  page: number;
  date: string;
}

// Компонент модального окна подтверждения удаления
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading: boolean;
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
          {title}
        </h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Удаление...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Удалить
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Состояние для новой заметки
  const [newNote, setNewNote] = useState({
    text: "",
    page: 0,
  });

  // Состояние для удаления заметки
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isDeletingNote, setIsDeletingNote] = useState(false);

  // Состояние книги
  const [book, setBook] = useState({
    id: params.id,
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    genre: "Классическая литература",
    year: 1967,
    pages: 480,
    currentPage: 312,
    rating: 4.8,
    status: "reading" as const,
    cover: null as string | null,
    description:
      "«Мастер и Маргарита» — роман Михаила Булгакова, работа над которым началась в конце 1920-х годов и продолжалась вплоть до смерти писателя. Роман относится к незавершённым произведениям; редактирование и сведение воедино черновых записей осуществляла после смерти мужа вдова писателя — Елена Сергеевна Булгакова.",
    reviews: [
      {
        id: 1,
        user: "Анна",
        rating: 5,
        text: "Великолепная книга! Одно из лучших произведений русской литературы. Перечитываю уже третий раз и каждый раз нахожу что-то новое.",
        date: "2024-01-15",
      },
      {
        id: 2,
        user: "Петр",
        rating: 4,
        text: "Очень интересное и глубокое произведение. Особенно понравилась линия Понтия Пилата.",
        date: "2024-02-20",
      },
    ],
    notes: [
      {
        id: 1,
        text: "Глава 2: «Понтий Пилат» — одна из самых сильных сцен в литературе. Булгаков мастерски показывает внутреннюю борьбу прокуратора. Особенно впечатляет диалог с Иешуа.",
        page: 45,
        date: "2024-03-15",
      },
      {
        id: 2,
        text: "Встреча Мастера и Маргариты описана невероятно поэтично. Желтые цветы стали символом их любви.",
        page: 178,
        date: "2024-03-20",
      },
      {
        id: 3,
        text: "Бал у Сатаны — кульминация романа. Интересно наблюдать как автор смешивает реальность и мистику.",
        page: 256,
        date: "2024-04-01",
      },
    ] as Note[],
  });

  const progress = Math.round((book.currentPage / book.pages) * 100);

  const tabs = [
    { key: "info", label: "Информация", icon: BookOpen },
    { key: "reviews", label: "Отзывы", icon: MessageSquare },
    { key: "notes", label: `Заметки (${book.notes.length})`, icon: StickyNote },
  ];

  // Функция для загрузки обложки
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBook((prev) => ({
          ...prev,
          cover: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Функция для изменения текущей страницы
  const handlePageChange = async (delta: number) => {
    const newPage = book.currentPage + delta;

    if (newPage < 0 || newPage > book.pages) return;

    setIsUpdatingProgress(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setBook((prev) => {
        const updated = { ...prev, currentPage: newPage };

        if (newPage === prev.pages) {
          updated.status = "completed";
        } else if (newPage > 0 && prev.status === "planned") {
          updated.status = "reading";
        }

        return updated;
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  // Функция для удаления книги
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsDeleteModalOpen(false);
      router.push("/books");
    } catch (error) {
      console.error("Error deleting book:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Функция для отметки книги как прочитанной
  const handleMarkAsCompleted = async () => {
    setIsUpdatingProgress(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setBook((prev) => ({
        ...prev,
        status: "completed",
        currentPage: prev.pages,
      }));
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  // Функция для сохранения новой заметки
  const handleSaveNote = async () => {
    if (
      !newNote.text.trim() ||
      newNote.page <= 0 ||
      newNote.page > book.pages
    ) {
      return;
    }

    setIsSavingNote(true);

    try {
      // Здесь будет API-запрос
      // await fetch(`/api/books/${book.id}/notes`, {
      //   method: 'POST',
      //   body: JSON.stringify(newNote)
      // })

      await new Promise((resolve) => setTimeout(resolve, 500));

      const note: Note = {
        id: Date.now(),
        text: newNote.text,
        page: newNote.page,
        date: new Date().toISOString().split("T")[0],
      };

      setBook((prev) => ({
        ...prev,
        notes: [note, ...prev.notes],
      }));

      // Сброс формы
      setNewNote({ text: "", page: 0 });
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSavingNote(false);
    }
  };

  // Функция для удаления заметки
  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    setIsDeletingNote(true);

    try {
      // Здесь будет API-запрос
      // await fetch(`/api/books/${book.id}/notes/${noteToDelete.id}`, {
      //   method: 'DELETE'
      // })

      await new Promise((resolve) => setTimeout(resolve, 500));

      setBook((prev) => ({
        ...prev,
        notes: prev.notes.filter((note) => note.id !== noteToDelete.id),
      }));

      setNoteToDelete(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeletingNote(false);
    }
  };

  const statusConfig = {
    reading: {
      icon: Clock,
      label: "Читаю",
      color: "bg-blue-100 text-blue-700",
      iconColor: "text-blue-600",
    },
    completed: {
      icon: CheckCircle2,
      label: "Прочитано",
      color: "bg-green-100 text-green-700",
      iconColor: "text-green-600",
    },
    planned: {
      icon: Bookmark,
      label: "В планах",
      color: "bg-yellow-100 text-yellow-700",
      iconColor: "text-yellow-600",
    },
  };

  const StatusIcon = statusConfig[book.status].icon;

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
            {/* Обложка */}
            <div className="w-full sm:w-48 h-64 flex-shrink-0 relative group">
              {book.cover ? (
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <label className="cursor-pointer">
                      <span className="text-white text-sm font-medium bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Изменить обложку
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                  <BookOpen className="w-20 h-20 text-white/30" />
                  <span className="text-white/50 text-sm mt-2">
                    Нет обложки
                  </span>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer">
                      <span className="text-white text-sm font-medium bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Загрузить обложку
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              <span
                className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${statusConfig[book.status].color}`}
              >
                <StatusIcon
                  className={`w-3 h-3 ${statusConfig[book.status].iconColor}`}
                />
                {statusConfig[book.status].label}
              </span>
            </div>

            {/* Информация */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
                    {book.title}
                  </h1>
                  <p className="text-gray-600 text-lg">{book.author}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-lg">{book.rating}</span>
                </div>
              </div>

              {/* Прогресс чтения */}
              <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-indigo-700">
                      {book.status === "completed"
                        ? "Прочитано"
                        : "Прогресс чтения"}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">
                    {book.currentPage} из {book.pages} стр.
                  </span>
                </div>

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

                {book.status !== "completed" && (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={() => handlePageChange(-1)}
                      disabled={book.currentPage <= 0 || isUpdatingProgress}
                      className="w-10 h-10 rounded-xl bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Уменьшить страницу"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border-2 border-indigo-100">
                      <span className="text-2xl font-bold text-indigo-600 min-w-[3ch] text-center">
                        {book.currentPage}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-600">{book.pages}</span>
                    </div>

                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={
                        book.currentPage >= book.pages || isUpdatingProgress
                      }
                      className="w-10 h-10 rounded-xl bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Увеличить страницу"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {book.status === "reading" && book.currentPage < book.pages && (
                  <button
                    onClick={handleMarkAsCompleted}
                    disabled={isUpdatingProgress}
                    className="w-full mt-3 px-4 py-2.5 rounded-xl bg-green-50 text-green-700 font-medium hover:bg-green-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUpdatingProgress ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Отметить как прочитанное
                  </button>
                )}

                {book.status === "completed" && (
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
                    <p className="font-medium text-sm">{book.genre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Год издания
                    </span>
                    <p className="font-medium text-sm">{book.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-xs text-gray-500 block">Страниц</span>
                    <p className="font-medium text-sm">{book.pages}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon
                    className={`w-4 h-4 ${statusConfig[book.status].iconColor}`}
                  />
                  <div>
                    <span className="text-xs text-gray-500 block">Статус</span>
                    <p className="font-medium text-sm">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusConfig[book.status].color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[book.status].label}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3">
                <button className="btn-primary flex-1">
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
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>

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
                      <span className="font-medium">{book.currentPage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Осталось страниц</span>
                      <span className="font-medium">
                        {book.pages - book.currentPage}
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
                        {book.rating}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Количество отзывов</span>
                      <span className="font-medium">{book.reviews.length}</span>
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
                Отзывы ({book.reviews.length})
              </h3>

              <ReviewForm bookId={book.id} />

              <div className="space-y-4 mt-6">
                {book.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold block text-sm">
                            {review.user}
                          </span>
                          <span className="text-xs text-gray-500">
                            {review.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-indigo-600" />
                Мои заметки ({book.notes.length})
              </h3>

              {/* Форма добавления заметки */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  Новая заметка
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Текст заметки
                    </label>
                    <textarea
                      value={newNote.text}
                      onChange={(e) =>
                        setNewNote((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      className="input-field min-h-[100px] resize-y"
                      placeholder="Запишите свои мысли, цитаты или впечатления..."
                    />
                  </div>

                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Страница
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newNote.page || ""}
                          onChange={(e) =>
                            setNewNote((prev) => ({
                              ...prev,
                              page: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="input-field"
                          placeholder="Номер страницы"
                          min="1"
                          max={book.pages}
                        />
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          из {book.pages}
                        </span>
                      </div>
                      {newNote.page > 0 &&
                        (newNote.page < 1 || newNote.page > book.pages) && (
                          <p className="text-xs text-red-500 mt-1">
                            Страница должна быть от 1 до {book.pages}
                          </p>
                        )}
                    </div>

                    <button
                      onClick={handleSaveNote}
                      disabled={
                        !newNote.text.trim() ||
                        newNote.page < 1 ||
                        newNote.page > book.pages ||
                        isSavingNote
                      }
                      className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-[48px]"
                    >
                      {isSavingNote ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Сохранить
                    </button>
                  </div>
                </div>
              </div>

              {/* Список заметок */}
              <div className="space-y-4">
                {book.notes.length === 0 ? (
                  <div className="text-center py-8">
                    <StickyNote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">У вас пока нет заметок</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Добавьте первую заметку, чтобы сохранить свои мысли о
                      книге
                    </p>
                  </div>
                ) : (
                  book.notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {note.text}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                              <BookMarked className="w-3.5 h-3.5" />
                              Стр. {note.page}
                            </span>
                            <span className="text-xs text-gray-400">
                              {note.date}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setNoteToDelete(note)}
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

      {/* Модальное окно подтверждения удаления книги */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Удалить книгу?"
        message={`Вы действительно хотите удалить книгу "${book.title}"? Это действие нельзя будет отменить. Все заметки и отзывы будут удалены.`}
        isLoading={isDeleting}
      />

      {/* Модальное окно подтверждения удаления заметки */}
      <DeleteConfirmModal
        isOpen={noteToDelete !== null}
        onClose={() => setNoteToDelete(null)}
        onConfirm={handleDeleteNote}
        title="Удалить заметку?"
        message={`Вы уверены, что хотите удалить эту заметку со страницы ${noteToDelete?.page}?`}
        isLoading={isDeletingNote}
      />
    </>
  );
}
