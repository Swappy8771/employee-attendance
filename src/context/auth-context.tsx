"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import type { EmployeeRole } from "@/data/mockEmployees";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function useAuth() {
  const { data: session, status } = useSession();

  const currentUser: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        role: session.user.role as EmployeeRole,
      }
    : null;

  const logout = () => signOut({ callbackUrl: "/" });

  return { currentUser, status, logout };
}
