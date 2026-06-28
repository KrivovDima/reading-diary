import z from "zod";

export const getZodErrorMessages = <T>(error: z.ZodError<T>) => {
  const errorMessages = JSON.parse(error.message) as { message: string }[];

  return errorMessages.map(({ message }) => message).join(". ");
};
