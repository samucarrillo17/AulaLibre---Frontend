"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { Course, PaginatedCourses } from "@/app/interfaces/course";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function findOneCourseAction(term: string) {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.get<Course>(`${API_URL}/course/${term}`, {
      headers,
    });
    return { success: true, data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Asignatura no encontrada",
      };
    }
    return { success: false, error: "Error al obtener la asignatura" };
  }
}

export async function getCoursesAction(page = 1, limit = 10) {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.get<PaginatedCourses>(`${API_URL}/course`, {
      params: { page, limit },
      headers,
    });
    return { success: true, courses:data.data ,stats: data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Error al obtener las asignaturas",
      };
    }
    return { success: false, error: "Error de conexión con el servidor" };
  }
}

export async function createCourseAction(
  facultyId: string,
  name: string,
) {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.post<Course>(
      `${API_URL}/course/${facultyId}`,
      { name },
      { headers },
    );
    return { success: true, data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al crear la asignatura",
      };
    }
    return { success: false, error: "Error de conexión con el servidor" };
  }
}
