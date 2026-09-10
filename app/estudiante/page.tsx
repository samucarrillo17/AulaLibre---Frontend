"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Course, PaginatedCourses } from "../interfaces/course";
import { getCoursesAction } from "@/server/courses/action";
import { logoutAction } from "@/server/auth/action";

export default function StudentPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [stats, setStats] = React.useState<PaginatedCourses>();
  const [page, setPage] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState("");


  
  const getCourses = React.useCallback(async (currentPage: number) => {
    setLoading(true);
    const result = await getCoursesAction(currentPage);

    if (result.success && result.courses && result.stats) {
      setCourses(result.courses);
      setStats(result.stats);
    }
    setLoading(false);
  }, []);

 
  React.useEffect(() => {
    getCourses(page);
  }, [page, getCourses]);

  const filtered = React.useMemo(():Course[] => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter( 
      (c) =>
        c.name.toLowerCase().includes(q),
    );
  }, [courses, query]);

  const logout = async () => {
    const response = await logoutAction();
    return response
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <span className="font-semibold tracking-tight">Aula Libre</span>
          </div>
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground cursor-pointer"
              onClick={logout}
            >
              <LogOut className="size-4" data-icon="inline-start" />
              Salir
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Asignaturas de la universidad
          </h1>
          <p className="text-sm text-muted-foreground">
            Busca una asignatura o explora todas las registradas.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            placeholder="Buscar por nombre o facultad..."
            className="h-11 pl-9"
            aria-label="Buscar asignatura"
            onChange={(e)=> setQuery(e.target.value)}
          />
        </div>

        {/* Results meta */}
        <p className="mt-4 text-sm text-muted-foreground">
          {stats?.total !== 0
            ? ` ${stats?.total} asignaturas encontradas `
            : "0 asignaturas encontradas"}
        </p>

        <div className="mt-3 flex flex-col gap-3">
          {filtered.map((c) => {
            return (
              <Link key={c.id} href={`/materia/${c.id}`} className="group">
                <Card className="transition-colors group-hover:border-primary/40">
                  <CardContent className="flex items-center justify-between gap-4 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-medium">{c.name}</span>
                      <Badge variant="secondary" className="w-fit">
                        {c.faculty.name}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {c.commentsCount > 0 ? (
                        <>
                          <span className="text-xs text-muted-foreground">
                            {c.commentsCount} reseña
                            {c.commentsCount > 1 ? "s" : ""}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Sin reseñas
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {courses.length === 0 && (
            <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
              No se encontraron asignaturas
            </div>
          )}

          {stats && stats.lastPage > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <Button
                className="cursor-pointer"
                variant="outline"
                size="sm"
                disabled={stats.page <= 1 || loading}
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
                disabled={stats.page >= stats.lastPage || loading}
                onClick={() => setPage((p) => Math.min(stats.lastPage, p + 1))}
              >
                Siguiente
                <ChevronRight className="size-4" data-icon="inline-end" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
