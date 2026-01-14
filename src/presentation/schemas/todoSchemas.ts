import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(255).optional().nullable(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(255).optional().nullable(),
  completed: z.boolean().optional(),
});

export const paramIdSchema = z.object({
  id: z.coerce.number().positive(),
});
