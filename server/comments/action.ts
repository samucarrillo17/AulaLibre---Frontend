"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { Comments, PaginatedComments } from "@/app/interfaces/comments";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCommentsAction(courseId: string) {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.get(`${API_URL}/comments/${courseId}`, {
      headers,
    });

    return {
      success: true,
      comments: (data.data || data) as Comments[],
      stats: data.total ? (data as PaginatedComments) : undefined,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al obtener los comentarios",
      };
    }
    return { success: false, error: "Error de conexión con el servidor" };
  }
}
