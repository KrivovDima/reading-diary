import { BookOpen, Library, PenTool } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const isAuthenticated = false;

  return (
    <div className="text-center">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Personal Reading Diary
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your reading journey, write reviews, and discover new books to
          read.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Library className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Track Your Books</h3>
          <p className="text-gray-600">
            Keep a record of all the books you've read, are reading, or plan to
            read.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <PenTool className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Write Reviews</h3>
          <p className="text-gray-600">
            Share your thoughts and rate the books you've completed.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Take Notes</h3>
          <p className="text-gray-600">
            Add notes and track your progress while reading.
          </p>
        </div>
      </div>

      <div className="space-x-4">
        {isAuthenticated ? (
          <Link
            href="/books"
            className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700"
          >
            View My Books
          </Link>
        ) : (
          <>
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-medium border border-indigo-600 hover:bg-indigo-50"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
