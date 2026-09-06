"use client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { GraduationCap, Mail, Lock } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { useForm } from "react-hook-form"


import toast from "react-hot-toast";
import { loginAction } from "@/server/auth/action";
import { LoginInput, loginSchema } from "@/app/schemas/auth-schema";
import { getPostLoginRedirect } from "@/app/lib/helper";



export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit,
    register,
    formState: { isSubmitting,errors },
  } = form;


  const onSubmitLogin = async (values: LoginInput) => {
    const { email, password } = values;
    try {
      const result = await loginAction(email, password);
      if (!result.success) {
        toast.error("Correo o contrasena incorrecto", {
          duration: 2000
        });
        return
      }

       const from = searchParams.get("from");
       const target = getPostLoginRedirect(result.data.role, from);

       router.push(target);
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
            <CardTitle className="text-xl">Iniciar sesión</CardTitle>
            <CardDescription>
              Ingresa tus datos para acceder a las reseñas
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form id="auth-form" onSubmit={handleSubmit(onSubmitLogin)}>
              <FieldGroup>
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
                <Button type="submit" className="w-full">
                  Iniciar sesión
                </Button>
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-t">
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Regístrate
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
