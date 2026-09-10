"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { StarRating } from "@/components/star-rating";
import {
  UpdateCommentInput,
  updateCommentSchema,
} from "@/app/schemas/comment-schema";
import { updateCommentAction } from "@/server/comments/action";
import { useRouter } from "next/navigation";

export type ReviewInput = {
  professor: string;
  rating: number;
  reason: string;
};

type EditReviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (input: ReviewInput) => void;
  initial?: ReviewInput;
  params: string;
  commentId: string;
  
};

export function EditReviewDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
  params,
  commentId,
}: EditReviewDialogProps) {
  const form = useForm<UpdateCommentInput>({
    resolver: zodResolver(updateCommentSchema),
    defaultValues: {
      professorName: initial?.professor ?? "",
      rating: initial?.rating ?? 0,
      reason: initial?.reason ?? "",
    },
  });
  const router = useRouter();
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  React.useEffect(() => {
    if (open && initial) {
      reset({
        professorName: initial.professor ?? "",
        rating: initial.rating ?? 0,
        reason: initial.reason ?? "",
      });
    }
  }, [open, initial, reset]);

  async function onSubmitForm(values: UpdateCommentInput) {
    try {
   
      const result = await updateCommentAction(commentId, values, params);

      if (!result?.success) {
        toast.error(result?.error || "Error al actualizar la reseña");
        return;
      }

      toast.success("Reseña actualizada exitosamente");
      onOpenChange(false);

      router.refresh(); // Refresca la página para mostrar el comentario actualizado
      onSubmit?.({
        professor: values.professorName ?? "",
        rating: values.rating ?? 0,
        reason: values.reason ?? "",
      });
    } catch (error) {
      console.error("Error al actualizar el comentario:", error);
      toast.error("Ocurrió un error inesperado al actualizar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar reseña</DialogTitle>
          <DialogDescription>
            Modifica los datos de tu experiencia con la asignatura.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">
              Normas de la comunidad
            </span>
            <p className="text-muted-foreground">
              Sé respetuoso. Tu edición debe mantener un lenguaje constructivo.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)}>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel htmlFor="professor">Nombre del profesor</FieldLabel>
              <Input
                id="professor"
                placeholder="Ej. Dra. Elena Ramírez"
                {...register("professorName")}
              />
              {errors.professorName && (
                <span className="text-xs text-destructive">
                  {errors.professorName.message}
                </span>
              )}
            </Field>

            {/* Solución Error 1: Fallback (field.value ?? 0) */}
            <Field>
              <FieldLabel>Calificación</FieldLabel>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <StarRating
                    value={field.value ?? 0}
                    onChange={field.onChange}
                    size={28}
                  />
                )}
              />
              {errors.rating && (
                <span className="text-xs text-destructive">
                  {errors.rating.message}
                </span>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="reason">
                Razones de tu calificación
              </FieldLabel>
              <Textarea
                id="reason"
                rows={4}
                placeholder="Describe tu experiencia..."
                {...register("reason")}
              />
              {errors.reason && (
                <span className="text-xs text-destructive">
                  {errors.reason.message}
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
