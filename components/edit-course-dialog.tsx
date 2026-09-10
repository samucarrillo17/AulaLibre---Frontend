"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { Course, Faculty } from "@/app/interfaces/course";
import {
  UpdateCourseInput,
  UpdateCourseSchema,
} from "@/app/schemas/course-schema";
import { UpdateCourseAction } from "@/server/courses/action";
import { getFacultieAction } from "@/server/faculties/action";

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseSelected: Course | null;
  onSuccess?: (page:number) => void;
  page:number
}

export function EditCourseDialog({
  open,
  onOpenChange,
  courseSelected,
  onSuccess,
  page
}: EditCourseDialogProps) {
  const [faculties, setFaculties] = React.useState<Faculty[]>([]);
  const router = useRouter();

  const form = useForm<UpdateCourseInput>({
    resolver: zodResolver(UpdateCourseSchema),
    defaultValues: {
      nameCourse: "",
      facultyId: "",
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  // Cargar facultades al montar
  useEffect(() => {
    getFaculties();
  }, []);

  const getFaculties = async () => {
    const result = await getFacultieAction();
    if (result.success && result.data) {
      setFaculties(result.data);
    }
  };

  
  useEffect(() => {
    if (open && courseSelected) {
      reset({
        nameCourse: courseSelected.name ?? "",
        facultyId: courseSelected.faculty?.id ?? "",
      });
    }
  }, [open, courseSelected, reset]);

  async function onSubmitEdit(values: UpdateCourseInput) {
    if (!courseSelected?.id) return;

    try {
      const result = await UpdateCourseAction(courseSelected.id, values);

      if (!result?.success) {
        toast.error(result?.error || "Error al actualizar la asignatura");
        return;
      }

      toast.success("Curso actualizado exitosamente");
      onOpenChange(false);
      onSuccess?.(page)
      router.refresh();
    } catch (error) {
      console.error("Error al actualizar el curso:", error);
      toast.error("Ocurrió un error inesperado al actualizar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar Curso</DialogTitle>
          <DialogDescription>
            Realiza los cambios necesarios y haz clic en &apos;Guardar
            cambios&apos;.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitEdit)}>
          <FieldGroup className="space-y-4">
            {/* Campo: Nombre del Curso */}
            <Field>
              <Label htmlFor="nameCourse">Nombre del Curso</Label>
              <Input
                id="nameCourse"
                placeholder="Ej. Cálculo Integral"
                {...register("nameCourse")}
              />
              {errors.nameCourse && (
                <span className="text-xs text-destructive">
                  {errors.nameCourse.message}
                </span>
              )}
            </Field>

            {/* Campo: Facultad */}
            <Field>
              <Label htmlFor="facultyId">Facultad</Label>
              <select
                id="facultyId"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("facultyId")}
              >
                <option value="">Selecciona una facultad...</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
              {errors.facultyId && (
                <span className="text-xs text-destructive">
                  {errors.facultyId.message}
                </span>
              )}
            </Field>

            <DialogFooter className="mt-4">
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
