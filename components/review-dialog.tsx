"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  CreateCommentInput,
  createCommentSchema,
} from "@/app/schemas/comment-schema";
import { createCommentAction } from "@/server/comments/action";
import toast from "react-hot-toast";
import { Comments } from "@/app/interfaces/comments";
import { useRouter } from "next/navigation";

export type ReviewInput = {
  professor: string;
  rating: number;
  reason: string;
};



type ReviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (input: ReviewInput) => void;
  initial?: ReviewInput;
  params: string;
 
};

export function ReviewDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
  params,
}: ReviewDialogProps) {
  const form = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      professorName: "",
      rating: 0,
      reason: "",
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

  // Sincroniza los valores iniciales con el formulario cuando se abre el modal
  React.useEffect(() => {
    if (open) {
      reset({
        professorName: initial?.professor ?? "",
        rating: initial?.rating ?? 0,
        reason: initial?.reason ?? "",
      });
    }
  }, [open, initial, reset]);

  async function onSubmitForm(values: CreateCommentInput) {
    try {
      const result = await createCommentAction(params, values);

      if (result.success) {
        onOpenChange(false);
        onSubmit?.({
          professor: values.professorName,
          rating: values.rating,
          reason: values.reason,
        });
      }
      toast.success("Comentario creado exitosamente");
      router.refresh(); // Refresca la página para mostrar el nuevo comentario
    } catch (error) {
      console.error("Error al crear el comentario:", error);
      toast.error("Error al crear el comentario");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publicar reseña</DialogTitle>
          <DialogDescription>
            Comparte tu experiencia para ayudar a otros estudiantes.
          </DialogDescription>
        </DialogHeader>

        {/* Reglas de la comunidad */}
        <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">
              Normas de la comunidad
            </span>
            <p className="text-muted-foreground">
              Sé respetuoso. No se permiten insultos, ataques personales ni
              lenguaje ofensivo. Enfócate en la asignatura y en la enseñanza.
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

            
            <Field>
              <FieldLabel>Calificación</FieldLabel>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <StarRating
                    value={field.value}
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
                placeholder="Describe tu experiencia con la asignatura y el profesor..."
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
                {isSubmitting ? "Guardando..." : "Publicar"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
