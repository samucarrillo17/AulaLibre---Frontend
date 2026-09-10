"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { Course, PaginatedCourses } from "@/app/interfaces/course";
import { UpdateCourseInput } from "@/app/schemas/course-schema";
import { revalidatePath } from "next/cache";



async function getAuthHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function findOneCourseAction(term: string) {
  try {
    const headers = await getAuthHeader();
    const { data } = await axios.get<Course>(`${process.env.API_URL}/course/${term}`, {
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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, error: "No autenticado" };

    const { data } = await axios.get<PaginatedCourses>(
      `${process.env.API_URL}/course?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return { success: true, courses: data.data, stats: data };
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


export async function createCourseAction(facultyId: string, name: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, error: "No autenticado" };

    const { data } = await axios.post<Course>(
      `${process.env.API_URL}/course/${facultyId}`,
      { name }, 
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Error al crear asignatura",
    };
  }
}

export async function UpdateCourseAction(
  courseId: string,
  values: UpdateCourseInput,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, error: "No autenticado" };

    
    const payload: Record<string, any> = {};
    if (values.nameCourse) payload.name = values.nameCourse;
    if (values.facultyId) payload.facultyId = values.facultyId;

    const { data } = await axios.patch<Course>(
      `${process.env.API_URL}/course/${courseId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    
    revalidatePath("/admin/asignaturas");

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Error al actualizar la asignatura",
    };
  }
}

export async function RemoveCourseAction(
  courseId: string,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { success: false, error: "No autenticado" };

    const { data } = await axios.delete(
      `${process.env.API_URL}/course/${courseId}`,
       { headers: { Authorization: `Bearer ${token}` }},
    );

    revalidatePath("/admin/asignaturas");

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Error al actualizar la asignatura",
    };
  }
}
