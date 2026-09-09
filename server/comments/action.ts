"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { Comments, PaginatedComments } from "@/app/interfaces/comments";
import { CreateCommentInput, UpdateCommentInput } from "@/app/schemas/comment-schema";
import { revalidatePath } from "next/cache";



async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCommentsAction(courseId: string) {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.get<PaginatedComments>(`${process.env.API_URL}/comment/${courseId}`, {
      headers,
    });

    
    return {
      success: true,
      comments: data.data,
      stats: data
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

export async function createCommentAction(courseId: string, values:CreateCommentInput ) {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.post(
      `${process.env.API_URL}/comment/${courseId}`,
      values,
      {
        headers,
      },
    );
    revalidatePath(`/materia/${courseId}`);
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


export async function updateCommentAction(
  commentId: string,
  values: UpdateCommentInput,
  courseId: string
) {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.patch(
      `${process.env.API_URL}/comment/${commentId}?course=${courseId}`,
      values,
      {
        headers,
      },
    );
    revalidatePath(`/materia/${courseId}`);
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

export async function removeCommentAction(
  commentId: string,
  courseId: string
) {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.delete(
      `${process.env.API_URL}/comment/${commentId}?course=${courseId}`,
      {
        headers,
      }
    );
    revalidatePath(`/materia/${courseId}`);
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
