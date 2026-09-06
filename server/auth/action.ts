"use server";

import { RegisterInput } from "@/app/schemas/auth-schema";
import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function loginAction(email: string, password: string) {
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (data.token && data.role) {
      const cookieStore = await cookies();
      cookieStore.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      cookieStore.set("role", data.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return { success: true, data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
    return { success: false, error: "Error de conexión con el servidor" };
  }
}

export async function registerAction(dataRegister: RegisterInput) {
  try {
    const { confirmPassword, ...registerDto } = dataRegister;

    const { data } = await axios.post(
      `${process.env.API_URL}/api/auth/register`,
      registerDto,
    );

    const token = data.access_token || data.token;

    if (!token) {
      return { success: false, error: "No se recibió un token de registro" };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Error al registrar usuario",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("role");
}
