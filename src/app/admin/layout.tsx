import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

const sidebarItems = [
  { label: "Overview", href: "/admin/overview" },
  { label: "Attendance", href: "/admin/attendance" },
  { label: "Employees", href: "/admin/employees" },
  { label: "Reporting", href: "/admin/reporting" },
  { label: "Notifications", href: "/admin/notifications" },
];

const headerActions = (
  <>
    <button className="rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.3em]">
      Invite team
    </button>
    <button className="rounded-full bg-amber-400 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-900">
      Export view
    </button>
  </>
);

export const metadata = {
  title: "PulseDesk Admin",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell title="Admin dashboard" sidebarItems={sidebarItems} headerActions={headerActions}>
      {children}
    </AppShell>
  );
}
