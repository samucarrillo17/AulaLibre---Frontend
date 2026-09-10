"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus, Pencil, Trash2, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/star-rating";
import { ReviewDialog, type ReviewInput } from "@/components/review-dialog";

import {
  Comments,
  CourseComment,
  PaginatedComments,
} from "@/app/interfaces/comments";
import { getCommentsAction } from "@/server/comments/action";
import { findOneCourseAction } from "@/server/courses/action";
import { EditReviewDialog } from "@/components/edit-reviev-dialog";
import { RemoveAlert } from "@/components/remove-dialog";

export default function SubjectDetailPage() {
  const params = useParams<{ id: string }>();

  const [dialogOpenReview, setDialogOpenReview] = React.useState(false);
  const [dialogOpenEdit, setDialogOpenEdit] = React.useState(false);
  const [dialogOpenDelete, setDialogOpenDelete] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string>("");
  const [deleteId, setDeleteId] = React.useState<string>("");
  const [editingComment, setEditingComment] = React.useState<ReviewInput>();
  const [comments, setComments] = React.useState<Comments[]>([]);
  const [stats, setStats] = React.useState<PaginatedComments>();
  const [course, setCourse] = React.useState<CourseComment>({
    id: "",
    name: "",
    faculty: { id: "", name: "" },
  });
  const [loading, setLoading] = React.useState(true);

  const timeAgo = (createdAt: Date | string) => {
    const date = new Date(createdAt);
    const diff = Date.now() - date.getTime();

    // Validación por si llega una fecha inválida
    if (isNaN(diff)) return "Fecha inválida";

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Hace un momento";
    if (minutes < 60)
      return `Hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    if (hours < 24) return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
    if (days === 1) return "Ayer";
    if (days < 30) return `Hace ${days} días`;

    const months = Math.floor(days / 30);
    if (months < 12) return `Hace ${months} ${months === 1 ? "mes" : "meses"}`;

    const years = Math.floor(days / 365);
    return `Hace ${years} ${years === 1 ? "año" : "años"}`;
  };

  const loadData = React.useCallback(async () => {
    if (!params?.id) return;
    

    const [commentsResult, courseResult] = await Promise.all([
      getCommentsAction(params.id),
      findOneCourseAction(params.id),
    ]);

    if (commentsResult.success && commentsResult.comments) {
      setComments(commentsResult.comments);
      if (commentsResult.stats) setStats(commentsResult.stats);
    }

    if (courseResult.success && courseResult.data) {
      setCourse(courseResult.data);
    }

    
  }, [params?.id]);

  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) loadData();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  function handleAdd() {
    setEditingId("");
    setDialogOpenReview(true);
  }

  function handleEdit(idComment: string, comment: Comments) {
    setEditingId(idComment);
    setDialogOpenEdit(true);
    setEditingComment({
      professor: comment.professorName,
      rating: comment.rating,
      reason: comment.reason,
    });
  }

  function handleDelete(idComment: string) {
    setDeleteId(idComment);
    setDialogOpenDelete(true);
  }

  function handleSubmit(input: ReviewInput) {
    loadData()
  }

  if (!course) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Esta asignatura no existe.</p>
        <Link href="/estudiante">
          <Button className="cursor-pointer" variant="outline">
            Volver a las asignaturas
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link href="/estudiante">
            <Button
              className="cursor-pointer"
              variant="ghost"
              size="icon-sm"
              aria-label="Volver"
            >
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <span className="text-sm font-medium text-muted-foreground">
            Asignatura
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Subject summary */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {course.name || "..."}
            </h1>
            <Badge variant="secondary" className="w-fit">
              {course.faculty.name || "..."}
            </Badge>
          </div>
          
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Comentarios y recomendaciones
          </h2>
          <Button className="cursor-pointer" size="sm" onClick={handleAdd}>
            <Plus className="size-4" data-icon="inline-start" />
            Agregar
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Reviews list */}
        {comments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-14 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MessageSquare className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Todavía no hay reseñas</p>
              <p className="text-sm text-muted-foreground">
                Sé el primero en compartir tu experiencia.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {comments.map((c) => (
              <Card key={c.id}>
                <CardContent className="flex flex-col gap-3 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{c.professorName}</span>
                      <StarRating value={c.rating} size={15} readOnly />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {c.reason}
                  </p>

                  {c.isOwner ? (
                    <div className="flex items-center gap-1">
                      <Button
                        className="cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(c.id, c)}
                      >
                        <Pencil className="size-3.5" data-icon="inline-start" />
                        Editar
                      </Button>
                      <Button
                        
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive cursor-pointer"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="size-3.5" data-icon="inline-start" />
                        Eliminar
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <ReviewDialog
        open={dialogOpenReview}
        onOpenChange={setDialogOpenReview}
        onSubmit={handleSubmit}
        params={params.id}
      />

      <EditReviewDialog
        open={dialogOpenEdit}
        onOpenChange={setDialogOpenEdit}
        onSubmit={handleSubmit}
        params={params.id}
        initial={editingComment}
        commentId={editingId}
      />

      <RemoveAlert
        open={dialogOpenDelete}
        onOpenChange={setDialogOpenDelete}
        params={params.id}
        commentId={deleteId}
        onSuccess={loadData}
      />
    </div>
  );
}
