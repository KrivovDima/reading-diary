"use client";

import { Prisma } from "@/generated/prisma/client";
import { BookForm } from "@/widgets/book-form";
import { format } from "date-fns";
import { Edit2, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useActionState, useState } from "react";
import {
  addNoteAction,
  AddNoteActionState,
  deleteBookAction,
  updateBookAction,
  updateCurrentPageAction,
} from "../actions";
import toast from "react-hot-toast";

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
  const [showNoteForm, setShowNoteForm] = useState(false);

  const handleAddNote = async (
    _prevState: AddNoteActionState,
    formData: FormData,
  ) => {
    const result = await addNoteAction(formData, id);

    if (result?.error) {
      toast.error(result.error);
    }

    setShowNoteForm(false);

    return result;
  };

  const [, addNote] = useActionState<AddNoteActionState, FormData>(
    handleAddNote,
    undefined,
  );

  const progress =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  const handleUpdateBook = async (
    _prevState: UpdateBookActionState,
    formData: FormData,
  ) => {
    const data = await updateBookAction(id, formData);

    setIsEditing(false);

    return data;
  };

  const handleDeleteBook = async () => {
    if (!confirm("Are you sure you want to delete this book?")) return;

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

  if (isEditing) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-8">Edit Book</h2>
        <BookForm
          action={handleUpdateBook}
          initialActionState={undefined}
          initialFormState={book}
        />
        <button
          onClick={() => setIsEditing(false)}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-600 hover:text-indigo-600"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={handleDeleteBook}
            className="p-2 text-gray-600 hover:text-red-600"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {false ? (
              <Image
                src={coverUrl}
                alt={title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Cover</span>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-gray-600">By {author}</p>
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {status}
            </span>
            {rating && (
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-lg">{String(rating)}/5</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Reading Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              {status === "READING" && (
                <div className="space-x-2">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => {
                      handleUpdateCurrentPage(Math.max(0, currentPage - 1));
                    }}
                    className="px-3 py-1 border rounded-md hover:bg-gray-50"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateCurrentPage(
                        Math.min(totalPages, currentPage + 1),
                      );
                    }}
                    className="px-3 py-1 border rounded-md hover:bg-gray-50"
                  >
                    +1
                  </button>
                </div>
              )}
            </div>
          </div>

          {startDate && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Dates</h3>
              <div className="space-y-2 text-gray-600">
                <p>Started: {format(new Date(startDate), "MMMM d, yyyy")}</p>
                {endDate && (
                  <p>Finished: {format(new Date(endDate), "MMMM d, yyyy")}</p>
                )}
              </div>
            </div>
          )}

          {review && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Review</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{review}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Notes</h3>
              <button
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="flex items-center text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Note
              </button>
            </div>

            {showNoteForm && (
              <form action={addNote} className="mb-6 p-4 border rounded-md">
                <textarea
                  name="noteContent"
                  placeholder="Write your note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                  required
                />
                <div className="flex items-center justify-between">
                  <input
                    name="notePage"
                    type="number"
                    placeholder="Page number (optional)"
                    className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    max={totalPages}
                    min={1}
                  />
                  <div className="space-x-2">
                    <button
                      onClick={() => setShowNoteForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            )}

            {notes && notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-gray-800">{note.content}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          {note.page && (
                            <span className="mr-4">Page {note.page}</span>
                          )}
                          <span>
                            {format(
                              new Date(note.createdAt),
                              "MMM d, yyyy HH:mm",
                            )}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {}}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No notes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
