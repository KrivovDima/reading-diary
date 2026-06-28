import z from "zod";

export const addBookShema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is requires"),
  coverUrl: z.url("Invalid URL").optional().or(z.literal("")),
  totalPages: z.number().min(1, "Total pages must be at least 1"),
  currentPage: z.number().min(0).default(0),
  status: z
    .enum(["READING", "COMPLETED", "PLANNED", "DROPPED"])
    .default("PLANNED"),
  rating: z.number().min(0).max(5).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  review: z.string().optional(),
});
