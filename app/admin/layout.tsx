"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookPlus, GraduationCap, LayoutDashboard, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/server/auth/action";

const NAV = [
  {
    label: "Registrar Asignatura",
    shortLabel: "Registrar",
    icon: BookPlus,
    href: "/admin/registrar",
  },
  {
    label: "Asignaturas registradas",
    shortLabel: "Ver todas",
    icon: LayoutDashboard,
    href: "/admin/asignaturas",
  },
];
const logout = async () => {
  const response = await logoutAction();
  return response;
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card md:flex">
        <div className="flex items-center gap-2 border-b px-5 py-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <span className="font-semibold tracking-tight">UniReviews</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Administrador
          </p>
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground cursor-pointer"
              onClick={logout}
            >
              <LogOut className="size-4" data-icon="inline-start" />
              Cerrar sesión
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Mobile nav */}
        <div className="flex gap-2 border-b bg-card px-4 py-3 md:hidden">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Button
                key={item.href}
                size="sm"
                variant={active ? "default" : "outline"}
              >
                <Link href={item.href}>
                  <item.icon className="size-4" data-icon="inline-start" />
                  {item.shortLabel}
                </Link>
              </Button>
            );
          })}
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
