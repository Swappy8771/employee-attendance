"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";

const ISO_TODAY = () => new Date().toISOString().split("T")[0];
const clockInText = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function EmployeeCheckInPage() {
  const { currentUser } = useAuth();
  const { getAttendanceForEmployee, markCheckIn, markCheckOut } = useData();

  const today = ISO_TODAY();
  const history = useMemo(
    () => (currentUser ? getAttendanceForEmployee(currentUser.id) : []),
    [currentUser, getAttendanceForEmployee]
  );

  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const todaysEntry = history.find((entry) => entry.date === today);
  const hasCheckedIn = Boolean(todaysEntry?.checkIn);
  const hasCheckedOut = Boolean(todaysEntry?.checkOut);
  const status = todaysEntry?.status ?? "absent";

  if (!currentUser) return null;

  const handleCheckIn = () => {
    markCheckIn(currentUser.id);
    setStatusMessage(`Checked in at ${clockInText()}`);
  };

  const handleCheckOut = () => {
    markCheckOut(currentUser.id);
    setStatusMessage(`Checked out at ${clockInText()}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="h-3 w-1/3 rounded-full bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-10 rounded-2xl bg-zinc-800/80" />
          <div className="h-10 rounded-2xl bg-zinc-800/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Check in / Check out</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Today: {today}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCheckIn}
            disabled={hasCheckedIn}
            className="rounded-full border border-amber-300/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300 disabled:opacity-40"
          >
            {hasCheckedIn ? "Checked in" : "Check in"}
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!hasCheckedIn || hasCheckedOut}
            className="rounded-full border border-emerald-300/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300 disabled:opacity-40"
          >
            {hasCheckedOut ? "Checked out" : "Check out"}
          </button>
        </div>
      </div>
      {statusMessage && (
        <motion.p
          className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {statusMessage}
        </motion.p>
      )}
      <p className="mt-2 text-xs text-zinc-400">
        Current status: <span className="text-amber-300">{status}</span>
      </p>
      {history.length === 0 && (
        <p className="mt-3 text-xs text-zinc-500">
          No attendance records yet. Click “Check in” to start your day.
        </p>
      )}
    </div>
  );
}
