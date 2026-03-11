"use client";

import { useMemo } from "react";
import { useData } from "@/context/data-context";

export default function AdminReportingPage() {
  const { employees, attendance } = useData();

  const activeEmployees = useMemo(
    () => employees.filter((employee) => employee.role === "employee" && employee.status === "active"),
    [employees]
  );

  const totalDays = useMemo(() => new Set(attendance.map((entry) => entry.date)).size || 1, [attendance]);

  const presentEntries = attendance.filter((entry) => entry.status !== "absent").length;
  const lateEntries = attendance.filter((entry) => entry.status === "late").length;
  const absences = attendance.filter((entry) => entry.status === "absent").length;

  const averagePresentPerDay = Math.round((presentEntries / totalDays) * 100) / 100;

  const metrics = [
    {
      label: "Average present/day",
      value: averagePresentPerDay.toFixed(2),
      helper: `${presentEntries} total present records`,
      tone: "text-emerald-400",
    },
    {
      label: "Late records",
      value: lateEntries,
      helper: "Check-in after 9:15 counts as late",
      tone: "text-amber-400",
    },
    {
      label: "Absences",
      value: absences,
      helper: "Days without check-in",
      tone: "text-rose-400",
    },
    {
      label: "Active employees",
      value: activeEmployees.length,
      helper: "Ready for today",
      tone: "text-white",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-white/5 bg-zinc-950/50 p-4 shadow-inner"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">{metric.label}</p>
          <p className={`mt-2 text-3xl font-semibold ${metric.tone}`}>{metric.value}</p>
          <p className="text-xs text-zinc-500">{metric.helper}</p>
        </div>
      ))}
    </div>
  );
}
