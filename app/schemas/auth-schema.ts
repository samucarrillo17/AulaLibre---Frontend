import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico es requerido." })
    .email({ message: "Ingresa un correo electrónico válido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
    .trim(),
  email: z
    .string()
    .min(1, { message: "El correo electrónico es requerido." })
    .email({ message: "Ingresa un correo electrónico válido." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
confirmPassword: z.string().min(1, { message: "La confirmación de contraseña es requerida." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
});

export type RegisterInput = z.infer<typeof registerSchema>;