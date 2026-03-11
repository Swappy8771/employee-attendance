"use client";

import { useEffect, useMemo, useState } from "react";
import { useData } from "@/context/data-context";

const statusTone = {
  present: "text-emerald-300",
  late: "text-amber-300",
  absent: "text-rose-300",
} as const;

type StatusKey = keyof typeof statusTone;

export default function AdminAttendancePage() {
  const { employees, todaysAttendance } = useData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const employeeRoster = useMemo(
    () => employees.filter((employee) => employee.role === "employee" && employee.status === "active"),
    [employees]
  );

  const attendanceByEmployee = useMemo(
    () => new Map(todaysAttendance.map((entry) => [entry.employeeId, entry])),
    [todaysAttendance]
  );

  const stats = useMemo(() => {
    const totals: Record<string, number> = {
      present: 0,
      late: 0,
      absent: 0,
    };

    employeeRoster.forEach((employee) => {
      const entry = attendanceByEmployee.get(employee.id);
      const status = entry?.status || "absent";
      totals[status] = (totals[status] ?? 0) + 1;
    });

    return totals;
  }, [employeeRoster, attendanceByEmployee]);

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="h-3 w-1/3 rounded-full bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-4 rounded-full bg-zinc-800/60" />
          <div className="h-4 rounded-full bg-zinc-800/60" />
        </div>
        <div className="h-32 rounded-2xl bg-zinc-800/70" />
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Attendance today</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Check-in / check-out overrides</p>
        </div>
        <span className="text-xs text-zinc-400">{employeeRoster.length} active employees</span>
      </div>
      <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-[11px] uppercase tracking-[0.3em] text-zinc-300">
        Attendance actions are owned by employees through their portal; data here reflects their check-in/out history.
      </div>
      <div className="text-sm text-zinc-300">
        <span className="mr-4 text-emerald-300">Present {stats.present}</span>
        <span className="mr-4 text-amber-300">Late {stats.late}</span>
        <span className="text-rose-300">Absent {stats.absent}</span>
      </div>
      {employeeRoster.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/20 bg-zinc-950/50 p-6 text-center text-sm text-zinc-400">
          No attendance records yet. Employees will appear once they check in.
        </p>
      ) : (
        <div className="space-y-3">
          {employeeRoster.map((employee) => {
            const entry = attendanceByEmployee.get(employee.id);
            const status = (entry?.status || "absent") as StatusKey;
            const checkIn = entry?.checkIn ?? "--";
            const checkOut = entry?.checkOut ?? "--";

            return (
              <div
                key={employee.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-zinc-950/60 p-4 text-sm shadow-inner shadow-black/40 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-white">{employee.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {employee.department} • Shift {employee.shift}
                  </p>
                  <div className="flex gap-3 text-xs text-zinc-400">
                    <span>Check-in {checkIn}</span>
                    <span>Check-out {checkOut}</span>
                    <span className={statusTone[status]}>Status {entry ? entry.status : "absent"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
