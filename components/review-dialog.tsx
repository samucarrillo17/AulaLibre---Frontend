"use client"

import * as React from "react"
import { ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { StarRating } from "@/components/star-rating"

export type ReviewInput = {
  professor: string
  rating: number
  reason: string
}

type ReviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: ReviewInput) => void
  initial?: ReviewInput
  mode?: "create" | "edit"
}

export function ReviewDialog({
  open,
  onOpenChange,
  onSubmit,
  initial,
  mode = "create",
}: ReviewDialogProps) {
  const [professor, setProfessor] = React.useState("")
  const [rating, setRating] = React.useState(0)
  const [reason, setReason] = React.useState("")

  // Sincroniza valores al abrir (para crear o editar)
  React.useEffect(() => {
    if (open) {
      setProfessor(initial?.professor ?? "")
      setRating(initial?.rating ?? 0)
      setReason(initial?.reason ?? "")
    }
  }, [open, initial])

  const valid = professor.trim() && rating > 0 && reason.trim().length >= 10

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    onSubmit({ professor: professor.trim(), rating, reason: reason.trim() })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar reseña" : "Publicar reseña"}
          </DialogTitle>
          <DialogDescription>
            Comparte tu experiencia para ayudar a otros estudiantes.
          </DialogDescription>
        </DialogHeader>

        {/* Reglas */}
        <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Normas de la comunidad</span>
            <p className="text-muted-foreground">
              Sé respetuoso. No se permiten insultos, ataques personales ni lenguaje ofensivo.
              Enfócate en la asignatura y en la enseñanza. Las faltas de respeto serán eliminadas.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="professor">Nombre del profesor</FieldLabel>
              <Input
                id="professor"
                placeholder="Ej. Dra. Elena Ramírez"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel>Calificación</FieldLabel>
              <StarRating value={rating} onChange={setRating} size={28} />
            </Field>

            <Field>
              <FieldLabel htmlFor="reason">Razones de tu calificación</FieldLabel>
              <Textarea
                id="reason"
                rows={4}
                placeholder="Describe tu experiencia con la asignatura y el profesor..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Field>

            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!valid}>
                {mode === "edit" ? "Guardar cambios" : "Publicar"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
