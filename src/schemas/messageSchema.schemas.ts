import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Message atleast be 10 character" })
    .max(300, { message: "Content must be no longer than 300 charcter" }),
});
