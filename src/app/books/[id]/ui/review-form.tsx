"use client";

import { Send, Star } from "lucide-react";
import { SubmitEventHandler, useState } from "react";
import { updateBookAction } from "../actions";

type ReviewFormProps = { bookId: string };

export const ReviewForm = ({ bookId }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set("rating", String(rating));
    formData.set("review", text);

    await updateBookAction(bookId, formData);

    setRating(0);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-6 border border-gray-200"
    >
      <h4 className="font-semibold mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400" />
        Оставить отзыв
      </h4>

      {/* Рейтинг */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Ваша оценка
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600 self-center">
              {rating} из 5
            </span>
          )}
        </div>
      </div>

      {/* Текст отзыва */}
      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-field resize-y"
          rows={4}
          placeholder="Поделитесь своими впечатлениями о книге..."
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">{text.length}/1000</span>
        </div>
      </div>

      {/* Кнопка отправки */}
      <button type="submit" className="btn-primary" disabled={!rating}>
        <Send className="w-4 h-4" />
        Опубликовать отзыв
      </button>
    </form>
  );
};
