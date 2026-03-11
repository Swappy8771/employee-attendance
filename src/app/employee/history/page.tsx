"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";

type StatusFilter = "all" | "present" | "late" | "absent";

export default function EmployeeHistoryPage() {
  const { currentUser } = useAuth();
  const { getAttendanceForEmployee } = useData();

  const history = useMemo(
    () => (currentUser ? [...getAttendanceForEmployee(currentUser.id)] : []),
    [currentUser, getAttendanceForEmployee]
  );

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filtered = useMemo(() => {
    return history.filter((entry) => {
      const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
      const entryDate = new Date(entry.date);
      const matchesStart = !dateRange.start || entryDate >= new Date(`${dateRange.start}T00:00:00`);
      const matchesEnd = !dateRange.end || entryDate <= new Date(`${dateRange.end}T23:59:59`);
      return matchesStatus && matchesStart && matchesEnd;
    });
  }, [dateRange.start, dateRange.end, history, statusFilter]);

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Attendance history</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Filter or export</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
          <span>{filtered.length} records</span>
          <span>{statusFilter.toUpperCase()}</span>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap gap-2">
          {(["all", "present", "late", "absent"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.3em] transition ${
                statusFilter === status ? "border-amber-300 text-amber-300" : "border-white/10 text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(event) => setDateRange((prev) => ({ ...prev, start: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(event) => setDateRange((prev) => ({ ...prev, end: event.target.value }))}
            className="rounded-2xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white"
          />
        </div>
      </div>
      <div className="mt-4 divide-y divide-white/5 text-sm">
        {filtered.length === 0 && (
          <p className="py-4 text-xs text-zinc-400">No records match the filters.</p>
        )}
        {filtered.slice(0, 6).map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold text-white">{entry.date}</p>
              <p className="text-xs text-zinc-400">
                Check-in {entry.checkIn ?? "--"} • Check-out {entry.checkOut ?? "--"}
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">{entry.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
