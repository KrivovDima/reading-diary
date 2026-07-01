import { BookForm } from "@/widgets/book-form";
import { addBookAction } from "./actions";

export default function AddBook() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Add New Book</h2>
      <BookForm action={addBookAction} initialActionState={undefined} />
    </div>
  );
}
