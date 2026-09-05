"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function loginAction(email: string, password: string) {
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });

    if (data.token) {
      const cookieStore = await cookies();
      cookieStore.set("token", data.token, {
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

export async function registerAction(userData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const { data } = await axios.post(`${API_URL}/auth/register`, userData);
    return { success: true, data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al registrar usuario",
      };
    }
    return { success: false, error: "Error de conexión con el servidor" };
  }
}
