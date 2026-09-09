import z from 'zod'

export const createCommentSchema = z.object({
  professorName: z
    .string()
    .min(2, {
      message: "El nombre del curso debe tener al menos 2 caracteres.",
    })
    .max(100, { message: "El nombre no puede exceder los 100 caracteres." })
    .trim(),
  rating: z
    .number()
    .min(1, { message: "La calificacion debe ser al menois de una estrella" })
    .max(5),

  reason: z
    .string()
    .min(10, { message: "El comentario debe tener al menos 10 caracteres." })
    .max(200, { message: "El comentario no puede exceder los 200 caracteres." })
    .trim(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = z.object({
  professorName: z
    .string()
    .min(2, {
      message: "El nombre del curso debe tener al menos 2 caracteres.",
    })
    .max(100, { message: "El nombre no puede exceder los 100 caracteres." })
    .trim().optional(),
  rating: z
    .number()
    .min(1, { message: "La calificacion debe ser al menois de una estrella" })
    .max(5).optional(),

  reason: z
    .string()
    .min(10, { message: "El comentario debe tener al menos 10 caracteres." })
    .max(200, { message: "El comentario no puede exceder los 200 caracteres." })
    .trim().optional(),
});

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;