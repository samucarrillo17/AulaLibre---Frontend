import z from "zod";

export const createCourseSchema = z.object({
  nameCourse: z
    .string()
    .min(2, {
      message: "El nombre del curso debe tener al menos 2 caracteres.",
    })
    .max(100, { message: "El nombre no puede exceder los 100 caracteres." })
    .trim(),
    facultyId: z.string().nonempty({ message: "Debes seleccionar una facultad." }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;


export const UpdateCourseSchema = z.object({
  nameCourse: z
    .string()
    .min(2, {
      message: "El nombre del curso debe tener al menos 2 caracteres.",
    })
    .max(100, { message: "El nombre no puede exceder los 100 caracteres." })
    .trim()
    .optional(),
  facultyId: z
    .string()
    .optional(),
});

export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
