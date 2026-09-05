"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { Faculty } from "@/app/interfaces/faculty";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createFacultyAction(name: string) {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.post<Faculty>(
      `${API_URL}/faculty`,
      { name },
      { headers },
    );
    return { success: true, data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al crear la facultad",
      };
    }
    return { success: false, error: "Error de conexión con el servidor" };
  }
}

export async function getFacultieAction() {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.get<Faculty[]>(`${API_URL}/faculty`, {
      headers,
    });
    return { success: true, data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al obtener las facultades",
      };
    }
    return { success: false, error: "Error de conexión con el servidor" };
  }
}
