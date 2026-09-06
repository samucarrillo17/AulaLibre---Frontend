const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  student: "/estudiante",
};

const ROLE_ALLOWED_PREFIX: Record<string, string> = {
  admin: "/admin",
  student: "/estudiante",
};

export function getPostLoginRedirect(
  role: string,
  from?: string | null,
): string {
  const home = ROLE_HOME[role] ?? "/login";
  const allowedPrefix = ROLE_ALLOWED_PREFIX[role];

  if (from && allowedPrefix && from.startsWith(allowedPrefix)) {
    return from;
  }

  return home;
}
