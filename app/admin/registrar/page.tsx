"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Faculty } from "@/app/interfaces/course";
import {
  createFacultyAction,
  getFacultieAction,
} from "@/server/faculties/action";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { createCourseAction } from "@/server/courses/action";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCourseInput, createCourseSchema } from "@/app/schemas/course-schema";
import { CreateFacultyInput, createFacultySchema } from "@/app/schemas/faculty-schema";


export default function RegistrarPage() {
  const [faculties, setFaculties] = React.useState<Faculty[]>([]);

  const courseForm = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: { nameCourse: "", facultyId: "" },
  });

  const facultyForm = useForm<CreateFacultyInput>({
    resolver: zodResolver(createFacultySchema),
    defaultValues: { nameFaculty: "" },
  });

  useEffect(() => {
    getFaculties();
  }, [facultyForm]);

  const getFaculties = async () => {
    const result = await getFacultieAction();
    if (result.success && result.data) {
      setFaculties(result.data);
    }
  };

  const onSubmitCourse = async (data: CreateCourseInput) => {
    const res = await createCourseAction(data.facultyId, data.nameCourse);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    toast.success("Asignatura creada correctamente");
  };

  const onSubmitFaculty = async (data: CreateFacultyInput) => {
    const res = await createFacultyAction(data.nameFaculty);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success("Facultad creada correctamente");
    facultyForm.reset();
    getFaculties();
  };

  return (
    <>
      <header className="flex items-center justify-between border-b bg-card px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Registrar Asignatura
          </h1>
          <p className="text-sm text-muted-foreground">
            Agrega nuevas asignaturas al catálogo.
          </p>
        </div>
        <Badge variant="secondary" className="md:hidden">
          Admin
        </Badge>
      </header>

      <div className="mx-auto grid max-w-4xl gap-6 p-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Nueva asignatura</CardTitle>
            <CardDescription>
              Completa los datos para registrarla.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={courseForm.handleSubmit(onSubmitCourse)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="subject-name">Nombre</FieldLabel>
                  <Input
                    id="subject-name"
                    placeholder="Ej. Cálculo Integral"
                    {...courseForm.register("nameCourse")}
                  />
                  {courseForm.formState.errors.nameCourse && (
                    <FieldError>
                      {courseForm.formState.errors.nameCourse.message}
                    </FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel>Facultad</FieldLabel>
                  <Controller
                    control={courseForm.control}
                    name="facultyId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una facultad">
                            {(value: string | null) =>
                              value
                                ? (faculties.find((f) => f.id === value)
                                    ?.name ?? "")
                                : "Selecciona una facultad"
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {faculties.map((faculty) => (
                            <SelectItem key={faculty.id} value={faculty.id}>
                              {faculty.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {courseForm.formState.errors.facultyId && (
                    <FieldError>
                      {courseForm.formState.errors.facultyId.message}
                    </FieldError>
                  )}
                </Field>

                <Button type="submit">Registrar asignatura</Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Registra una nueva facultad</CardTitle>
            <CardDescription>
              Completa los datos para registrarla.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={facultyForm.handleSubmit(onSubmitFaculty)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="faculty-name">Nombre</FieldLabel>
                  <Input
                    id="faculty-name"
                    placeholder="Ej. Ciencias Basicas"
                    {...facultyForm.register("nameFaculty")}
                  />
                  {facultyForm.formState.errors.nameFaculty && (
                    <FieldError>
                      {facultyForm.formState.errors.nameFaculty.message}
                    </FieldError>
                  )}
                </Field>
                <Button type="submit">Registrar facultad</Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Registradas recientemente
            </CardTitle>
            <CardDescription>Facultades en total</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3"></CardContent>
        </Card> */}
      </div>
    </>
  );
}
