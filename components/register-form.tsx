"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, User, IdCard } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { useForm } from "react-hook-form";

import { loginAction, registerAction } from "@/server/auth/action";
import toast from "react-hot-toast";
import { RegisterInput, registerSchema } from "@/app/schemas/auth-schema";

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = form;

  const onSubmitRegister = async (values: RegisterInput) => {
    try {
      const result = await registerAction(values);
      if (!result.success) {
        toast.error(result.error, {
          duration: 2000,
        });
        return;
      }
      toast.success("Registro exitoso");
      router.refresh();
    } catch (error) {
      return error;
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-6" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Aula Libre
          </span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Registrarse</CardTitle>
            <CardDescription>
              Crea una cuenta para acceder a las reseñas
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form id="auth-form" onSubmit={handleSubmit(onSubmitRegister)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nombre</FieldLabel>
                  <div className="relative">
                    <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="ej: Juan"
                      className="pl-9"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <FieldDescription className="text-destructive">
                      {errors.name.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
                  <div className="relative">
                    <IdCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="ej: Pérez"
                      className="pl-9"
                      {...register("lastName")}
                    />
                  </div>
                  {errors.lastName && (
                    <FieldDescription className="text-destructive">
                      {errors.lastName.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Correo</FieldLabel>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nombre@universidad.edu"
                      className="pl-9"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <FieldDescription className="text-destructive">
                      {errors.email.message}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      {...register("password")}
                    />
                  </div>

                  {errors.password ? (
                    <FieldDescription className="text-destructive">
                      {errors.password.message}
                    </FieldDescription>
                  ) : (
                    <FieldDescription>
                      Usa al menos 8 caracteres.
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirmar contraseña
                  </FieldLabel>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <FieldDescription className="text-destructive">
                      {errors.confirmPassword.message}
                    </FieldDescription>
                  )}
                </Field>
                <Button type="submit" className="w-full">
                  Registrarse
                </Button>
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-t">
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Inicia sesión
              </Link>
              {/* ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                    Inicia sesión
                  </Link> */}
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
