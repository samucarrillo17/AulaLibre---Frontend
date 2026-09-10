"use client";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useCallback, useEffect, useState } from "react";
import { Course, PaginatedCourses } from "@/app/interfaces/course";
import { Label } from "@/components/ui/label";
import { getCoursesAction } from "@/server/courses/action";
import { EditCourseDialog } from "@/components/edit-course-dialog";
import RemoveAlertCourse from "@/components/remove-alert-course";

export default function AsignaturasPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [courseSelected, setCourseSelected] = useState<Course>();
  const [stats, setStats] = useState<PaginatedCourses>();
  const [page, setPage] = useState<number>(1);

  const loadData = useCallback(
    async (currentPage: number) => {
      const result = await getCoursesAction(currentPage);
      if (result.success && result.courses) {
        setCourses(result.courses);
        setStats(result.stats);
      }
    },
    [openEditDialog, openDeleteAlert],
  );

  useEffect(() => {
    loadData(page);
  }, [page, loadData]);

  const handleEditCourse = (course: Course) => {
    setCourseSelected(course);
    setOpenEditDialog(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setCourseSelected(course);
    setOpenDeleteAlert(true);
  };

  return (
    <>
      <header className="flex items-center justify-between border-b bg-card px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Asignaturas registradas
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualiza, edita o elimina las asignaturas creadas.
          </p>
        </div>
        <Badge variant="secondary" className="md:hidden">
          Admin
        </Badge>
      </header>

      <div className="mx-auto max-w-5xl p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Todas las asignaturas</CardTitle>
            <CardDescription>asignaturas registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Facultad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {course.faculty.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            className="cursor-pointer"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Editar ${course.name}`}
                            onClick={() => handleEditCourse(course)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Eliminar ${course.name}`}
                            className="text-destructive hover:text-destructive cursor-pointer"
                            onClick={() => handleDeleteCourse(course)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {stats && stats.lastPage > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="sm"
                  disabled={stats.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" data-icon="inline-start" />
                  Anterior
                </Button>

                <span className="text-sm text-muted-foreground">
                  Página {stats.page} de {stats.lastPage}
                </span>

                <Button
                  className="cursor-pointer"
                  variant="outline"
                  size="sm"
                  disabled={stats.page >= stats.lastPage}
                  onClick={() =>
                    setPage((p) => Math.min(stats.lastPage, p + 1))
                  }
                >
                  Siguiente
                  <ChevronRight className="size-4" data-icon="inline-end" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit dialog */}
      <EditCourseDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        courseSelected={courseSelected!}
        onSuccess={loadData}
        page={page}
      />

      {/* Remove alert */}
      <RemoveAlertCourse
        open={openDeleteAlert}
        onOpenChange={setOpenDeleteAlert}
        courseSelected={courseSelected!}
        onSuccess={loadData}
        page={page}
      />
    </>
  );
}
