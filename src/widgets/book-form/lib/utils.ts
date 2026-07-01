import { bookFormShema } from "./validations";

export const getBookFormValidatedFields = (formData: FormData) => {
  const ratingValue = formData.get("rating");
  const startDateValue = formData.get("startDate") as string;
  const endDateValue = formData.get("endDate") as string;
  const validatedFields = bookFormShema.parse({
    title: formData.get("title"),
    author: formData.get("author"),
    coverUrl: formData.get("coverUrl") || undefined,
    totalPages: Number(formData.get("totalPages")),
    currentPage: Number(formData.get("currentPage")) || undefined,
    status: formData.get("status"),
    rating: ratingValue === "" ? undefined : Number(ratingValue),
    startDate: startDateValue
      ? new Date(startDateValue).toISOString()
      : undefined,
    endDate: endDateValue ? new Date(endDateValue).toISOString() : undefined,
    review: formData.get("review") || undefined,
  });

  return validatedFields;
};
