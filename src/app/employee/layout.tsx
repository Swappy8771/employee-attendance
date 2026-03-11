import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

const sidebarItems = [
  { label: "Check in", href: "/employee/check-in" },
  { label: "History", href: "/employee/history" },
  { label: "Profile", href: "/employee/profile" },
  { label: "Notifications", href: "/employee/notifications" },
];

const headerActions = (
  <button className="rounded-full border border-white/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
    Request support
  </button>
);

export const metadata = {
  title: "PulseDesk Employee",
};

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell title="Employee portal" sidebarItems={sidebarItems} headerActions={headerActions}>
      {children}
    </AppShell>
  );
}
