"use client";

import { ChangeEventHandler, useActionState, useState } from "react";
import z from "zod";
import { bookFormShema } from "../lib/validations";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Book } from "@/generated/prisma/client";

type State = { error?: string } | undefined;
type BookFormProps<T extends State> = {
  action: (state: Awaited<T>, formData: FormData) => Promise<T> | T;
  initialActionState: Awaited<T>;
  initialFormState?: Book;
};

export function BookForm<T extends State>({
  action,
  initialActionState,
  initialFormState,
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
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            {...register("title")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author *
          </label>
          <input
            {...register("author")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="file"
            accept="image/*"
            name="cover"
            onChange={handleFileChange}
          />
          {coverPreview && (
            <Image
              src={coverPreview}
              alt="Cover preview"
              className="mt-2 h-32 w-24 object-cover rounded-md"
              height={128}
              width={96}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Pages *
          </label>
          <input
            type="number"
            {...register("totalPages")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Page
          </label>
          <input
            type="number"
            {...register("currentPage")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="PLANNED">Planned</option>
            <option value="READING">Reading</option>
            <option value="COMPLETED">Completed</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating (0-5)
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            {...register("rating")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review
          </label>
          <textarea
            {...register("review")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {state?.error && (
        <div className="text-red-600 text-sm text-center">{state.error}</div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          Save Book
        </button>
      </div>
    </form>
  );
}
