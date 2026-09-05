import z from "zod";

export const createFacultySchema = z.object({
  nameFaculty: z
    .string()
    .min(2, {
      message: "El nombre de la facultad debe tener al menos 2 caracteres.",
    })
    .max(100, { message: "El nombre no puede exceder los 100 caracteres." })
    .trim(),
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
