"use client"

import * as React from "react"

export const FACULTIES = [
  "Ingeniería",
  "Ciencias de la Salud",
  "Ciencias Económicas",
  "Derecho",
  "Humanidades",
  "Ciencias Sociales",
  "Arquitectura y Diseño",
  "Ciencias Naturales",
] as const

export type Faculty = (typeof FACULTIES)[number]

export type Review = {
  id: string
  subjectId: string
  professor: string
  rating: number
  reason: string
  author: string
  createdAt: number
  mine?: boolean
}

export type Subject = {
  id: string
  name: string
  faculty: Faculty
}

type StoreContextValue = {
  subjects: Subject[]
  reviews: Review[]
  addSubject: (name: string, faculty: Faculty) => void
  updateSubject: (id: string, name: string, faculty: Faculty) => void
  deleteSubject: (id: string) => void
  getSubject: (id: string) => Subject | undefined
  reviewsFor: (subjectId: string) => Review[]
  addReview: (input: Omit<Review, "id" | "createdAt" | "mine" | "author">) => void
  updateReview: (id: string, input: Pick<Review, "professor" | "rating" | "reason">) => void
  deleteReview: (id: string) => void
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

const SEED_SUBJECTS: Subject[] = [
  { id: "s1", name: "Cálculo Diferencial", faculty: "Ingeniería" },
  { id: "s2", name: "Programación I", faculty: "Ingeniería" },
  { id: "s3", name: "Anatomía Humana", faculty: "Ciencias de la Salud" },
  { id: "s4", name: "Microeconomía", faculty: "Ciencias Económicas" },
  { id: "s5", name: "Derecho Constitucional", faculty: "Derecho" },
  { id: "s6", name: "Filosofía Moderna", faculty: "Humanidades" },
  { id: "s7", name: "Sociología General", faculty: "Ciencias Sociales" },
  { id: "s8", name: "Diseño Arquitectónico", faculty: "Arquitectura y Diseño" },
  { id: "s9", name: "Química Orgánica", faculty: "Ciencias Naturales" },
  { id: "s10", name: "Álgebra Lineal", faculty: "Ingeniería" },
  { id: "s11", name: "Estructuras de Datos", faculty: "Ingeniería" },
  { id: "s12", name: "Fisiología", faculty: "Ciencias de la Salud" },
  { id: "s13", name: "Macroeconomía", faculty: "Ciencias Económicas" },
  { id: "s14", name: "Derecho Penal", faculty: "Derecho" },
  { id: "s15", name: "Historia del Arte", faculty: "Humanidades" },
  { id: "s16", name: "Psicología Social", faculty: "Ciencias Sociales" },
  { id: "s17", name: "Urbanismo", faculty: "Arquitectura y Diseño" },
  { id: "s18", name: "Física General", faculty: "Ciencias Naturales" },
  { id: "s19", name: "Bases de Datos", faculty: "Ingeniería" },
  { id: "s20", name: "Estadística", faculty: "Ciencias Económicas" },
  { id: "s21", name: "Contabilidad Financiera", faculty: "Ciencias Económicas" },
  { id: "s22", name: "Redes de Computadoras", faculty: "Ingeniería" },
  { id: "s23", name: "Biología Celular", faculty: "Ciencias Naturales" },
  { id: "s24", name: "Literatura Contemporánea", faculty: "Humanidades" },
]

const SEED_REVIEWS: Review[] = [
  {
    id: "r1",
    subjectId: "s1",
    professor: "Dra. Elena Ramírez",
    rating: 5,
    reason:
      "Explica los límites y derivadas con ejemplos muy claros. Las tutorías extra ayudan mucho antes de los exámenes.",
    author: "Estudiante anónimo",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "r2",
    subjectId: "s1",
    professor: "Ing. Carlos Méndez",
    rating: 3,
    reason:
      "Sabe mucho del tema pero avanza rápido. Recomiendo repasar por tu cuenta con ejercicios adicionales.",
    author: "Estudiante anónimo",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
  {
    id: "r3",
    subjectId: "s2",
    professor: "Ing. Laura Torres",
    rating: 4,
    reason:
      "Buenas prácticas de laboratorio y proyectos aplicados. La retroalimentación de las tareas es puntual.",
    author: "Estudiante anónimo",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
]

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = React.useState<Subject[]>(SEED_SUBJECTS)
  const [reviews, setReviews] = React.useState<Review[]>(SEED_REVIEWS)

  const addSubject = React.useCallback((name: string, faculty: Faculty) => {
    setSubjects((prev) => [{ id: uid(), name, faculty }, ...prev])
  }, [])

  const updateSubject = React.useCallback((id: string, name: string, faculty: Faculty) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, name, faculty } : s)))
  }, [])

  const deleteSubject = React.useCallback((id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id))
    setReviews((prev) => prev.filter((r) => r.subjectId !== id))
  }, [])

  const getSubject = React.useCallback(
    (id: string) => subjects.find((s) => s.id === id),
    [subjects],
  )

  const reviewsFor = React.useCallback(
    (subjectId: string) =>
      reviews
        .filter((r) => r.subjectId === subjectId)
        .sort((a, b) => b.createdAt - a.createdAt),
    [reviews],
  )

  const addReview = React.useCallback(
    (input: Omit<Review, "id" | "createdAt" | "mine" | "author">) => {
      setReviews((prev) => [
        {
          ...input,
          id: uid(),
          createdAt: Date.now(),
          author: "Tú",
          mine: true,
        },
        ...prev,
      ])
    },
    [],
  )

  const updateReview = React.useCallback(
    (id: string, input: Pick<Review, "professor" | "rating" | "reason">) => {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...input } : r)),
      )
    },
    [],
  )

  const deleteReview = React.useCallback((id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const value = React.useMemo<StoreContextValue>(
    () => ({
      subjects,
      reviews,
      addSubject,
      updateSubject,
      deleteSubject,
      getSubject,
      reviewsFor,
      addReview,
      updateReview,
      deleteReview,
    }),
    [subjects, reviews, addSubject, updateSubject, deleteSubject, getSubject, reviewsFor, addReview, updateReview, deleteReview],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
