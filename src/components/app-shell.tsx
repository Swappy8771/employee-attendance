"use client";

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
      ? "bg-amber-500/10 text-amber-200"
      : "text-zinc-400 hover:text-white";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-900/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">PulseDesk</p>
            <nav className="flex items-center gap-4 text-sm font-semibold text-zinc-300">
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
          <div className="flex items-center gap-3 text-xs text-zinc-400">
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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Dashboard</p>
            <h1 className="text-2xl font-semibold text-white">{title}</h1>
            <p className="text-sm text-zinc-400">{tagline}</p>
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
        {sidebarItems.length > 0 && (
          <nav className="border-t border-zinc-800 bg-zinc-900/80 px-6 py-2 text-xs uppercase tracking-[0.3em] text-zinc-400 md:hidden">
            <div className="flex gap-3 overflow-x-auto">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1 transition ${
                    pathname.startsWith(item.href) ? "bg-amber-500 text-zinc-950" : "hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <div className="flex min-h-[calc(100vh-220px)]">
        {sidebarItems.length > 0 && (
          <aside className="hidden w-64 flex-col gap-2 border-r border-zinc-800 bg-zinc-950/80 p-4 text-xs uppercase tracking-[0.3em] text-zinc-400 md:flex">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl border border-transparent px-3 py-2 font-semibold tracking-[0.2em] ${activeSidebarClass(
                  item
                )}`}
              >
                {item.label}
              </Link>
            ))}
          </aside>
        )}
        <main className="flex-1 px-4 py-8 md:px-10">{children}</main>
      </div>

      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs uppercase tracking-[0.3em] text-zinc-500">
          Built for attendance-first teams.
        </div>
      </footer>
    </div>
  );
}
