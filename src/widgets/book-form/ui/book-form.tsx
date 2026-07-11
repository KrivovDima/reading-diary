"use client";

import { ChangeEventHandler, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { Book } from "@/generated/prisma/client";
import {
  X,
  BookOpen,
  Upload,
  User,
  Calendar,
  Bookmark,
  FileText,
  PlusCircle,
  Hash,
} from "lucide-react";

type State = { error?: string } | undefined;
type BookFormProps<T extends State> = {
  action: (state: Awaited<T>, formData: FormData) => Promise<T> | T;
  initialActionState: Awaited<T>;
  initialFormState?: Book;
  onCancel?: () => void;
};

export function BookForm<T extends State>({
  action,
  initialActionState,
  initialFormState,
  onCancel,
}: BookFormProps<T>) {
  const [state, formAction] = useActionState<T, FormData>(
    action,
    initialActionState,
  );

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const { register } = useForm<Book>({
    defaultValues: initialFormState,
  });

  const handleFileChange: ChangeEventHandler<
    HTMLInputElement,
    HTMLInputElement
  > = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-morphism rounded-3xl p-6 sm:p-8">
      <form action={formAction} className="space-y-6">
        {/* Загрузка обложки */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Обложка книги
          </label>
          <div className="flex items-center gap-4">
            {coverPreview ? (
              <div className="relative">
                <img
                  src={coverPreview}
                  alt="Preview"
                  className="w-24 h-32 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {}}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-32 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700">
                <Upload className="w-4 h-4" />
                {coverPreview ? "Изменить" : "Загрузить"}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                name="cover"
              />
            </label>
          </div>
        </div>

        {/* Название */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название книги *
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="input-field pl-12"
              placeholder="Введите название"
              required
              {...register("title")}
            />
          </div>
        </div>

        {/* Автор */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Автор *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="input-field pl-12"
              placeholder="Имя автора"
              required
              {...register("author")}
            />
          </div>
        </div>

        {/* Жанр и год */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-1" />
              Жанр
            </label>
            <select className="input-field">
              <option value="">Выберите жанр</option>
              <option value="fiction">Художественная литература</option>
              <option value="non-fiction">Нон-фикшн</option>
              <option value="science">Научная</option>
              <option value="fantasy">Фэнтези</option>
              <option value="mystery">Детектив</option>
              <option value="biography">Биография</option>
              <option value="history">История</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Год издания
            </label>
            <input type="number" className="input-field" placeholder="2024" />
          </div>
        </div>

        {/* Страницы и статус */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Количество страниц
            </label>
            <input
              type="number"
              className="input-field"
              placeholder="0"
              {...register("totalPages")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bookmark className="w-4 h-4 inline mr-1" />
              Статус
            </label>
            <select {...register("status")} className="input-field">
              <option value="PLANNED">В планах</option>
              <option value="READING">Читаю</option>
              <option value="COMPLETED">Прочитано</option>
              <option value="DROPPED">Брошено</option>
            </select>
          </div>
        </div>

        {/* Описание */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Описание
          </label>
          <textarea
            className="input-field min-h-[150px] resize-y"
            placeholder="Краткое описание книги..."
          />
        </div>

        {state?.error && (
          <div className="text-red-600 text-sm text-center">{state.error}</div>
        )}

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button type="submit" className="btn-primary">
            Сохранить
          </button>
          <button
            type="button"
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
