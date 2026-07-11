import { BookForm } from "@/widgets/book-form";
import { addBookAction } from "./actions";
import { PlusCircle } from "lucide-react";

export default function AddBook() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-8 flex items-center gap-3">
        <PlusCircle className="w-8 h-8 sm:w-10 sm:h-10" />
        Добавить книгу
      </h1>
      <BookForm action={addBookAction} initialActionState={undefined} />
    </div>
  );
}
