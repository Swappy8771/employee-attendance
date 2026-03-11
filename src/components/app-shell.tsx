"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";

type NavItem = {
  label: string;
  href: string;
};

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  sidebarItems?: NavItem[];
  headerActions?: React.ReactNode;
};

export function AppShell({
  children,
  title,
  sidebarItems = [],
  headerActions,
}: AppShellProps) {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();

  const navLinks = useMemo(() => {
    const base: NavItem[] = [{ label: "Home", href: "/" }];

    if (!currentUser) {
      return [...base, { label: "Login", href: "/login" }];
    }

    return [
      ...base,
      {
        label: currentUser.role === "admin" ? "Admin console" : "Employee portal",
        href: currentUser.role === "admin" ? "/admin" : "/employee",
      },
    ];
  }, [currentUser]);

  const tagline = currentUser
    ? currentUser.role === "admin"
      ? "Manage attendance, teams, and notifications."
      : "Track your check-ins and profile."
    : "Log in to continue.";

  const activeSidebarClass = (item: NavItem) =>
    pathname.startsWith(item.href)
      ? "bg-amber-500/20 text-amber-200 shadow-[-4px_0_10px_rgba(250,204,21,0.25)]"
      : "text-zinc-400 hover:text-white";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-900/95">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">PulseDesk</p>
            <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-zinc-200">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-3 py-1 transition ${
                      isActive ? "bg-white text-zinc-950" : "hover:bg-white/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            {currentUser ? (
              <>
                <span className="text-sm text-white">{currentUser.name}</span>
                <button
                  className="rounded-full border border-white/20 px-3 py-1 uppercase tracking-[0.4em]"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-white/20 px-3 py-1 uppercase tracking-[0.4em]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-zinc-800 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.6em] text-amber-200">Dashboard</p>
            <h1 className="text-3xl font-semibold text-white">{title}</h1>
            <p className="text-sm text-zinc-400">{tagline}</p>
          </div>
          {headerActions && <div className="flex flex-wrap gap-2">{headerActions}</div>}
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-220px)]">
        {sidebarItems.length > 0 && (
          <motion.aside
            className="hidden w-64 flex-col gap-3 border-r border-zinc-800 bg-zinc-950/80 p-5 text-xs uppercase tracking-[0.3em] text-zinc-400 md:flex"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl border border-white/5 px-3 py-2 font-semibold tracking-[0.2em] transition ${activeSidebarClass(
                  item
                )}`}
              >
                {item.label}
              </Link>
            ))}
          </motion.aside>
        )}
        <main className="flex-1 px-4 py-8 md:px-10">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </div>

      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs uppercase tracking-[0.3em] text-zinc-500">
          Built for attendance-first teams / Prototype experience.
        </div>
      </footer>
    </div>
  );
}
