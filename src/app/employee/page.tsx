"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";

const employeeSidebarItems = [
  { label: "Check in", href: "/employee#check-in" },
  { label: "History", href: "/employee#history" },
  { label: "Profile", href: "/employee#profile" },
  { label: "Notifications", href: "/employee#notifications" },
];

const employeeHeaderActions = (
  <button className="rounded-full border border-white/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
    Request support
  </button>
);

const ISO_TODAY = () => new Date().toISOString().split("T")[0];

export default function EmployeePage() {
  const { currentUser } = useAuth();
  const {
    getAttendanceForEmployee,
    markCheckIn,
    markCheckOut,
    employees,
    notifications,
    markNotificationRead,
    sendNotification,
    updateEmployee,
  } = useData();

  const history = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return [...getAttendanceForEmployee(currentUser.id)].sort((a, b) =>
      a.date > b.date ? -1 : b.date > a.date ? 1 : 0
    );
  }, [currentUser, getAttendanceForEmployee]);

  const today = ISO_TODAY();
  const todaysEntry = history.find((entry) => entry.date === today);
  const hasCheckedIn = Boolean(todaysEntry?.checkIn);
  const hasCheckedOut = Boolean(todaysEntry?.checkOut);

  const presentDays = history.filter((entry) => entry.status !== "absent").length;
  const lateDays = history.filter((entry) => entry.status === "late").length;

  const [statusFilter, setStatusFilter] = useState<"all" | "present" | "late" | "absent">("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [prefersSummary, setPrefersSummary] = useState(true);
  const employeeRecord = useMemo(
    () =>
      currentUser ? employees.find((employee) => employee.id === currentUser.id) : undefined,
    [currentUser, employees]
  );

  const [profileOverrides, setProfileOverrides] = useState<{
    department?: string;
    shift?: string;
  }>({});

  const profileForm = useMemo(() => {
    return {
      department:
        profileOverrides.department ?? employeeRecord?.department ?? "",
      shift: profileOverrides.shift ?? employeeRecord?.shift ?? "",
    };
  }, [employeeRecord, profileOverrides]);

  const filteredHistory = useMemo(() => {
    return history.filter((entry) => {
      const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
      const entryDate = new Date(entry.date);
      const matchesStart =
        !dateRange.start || entryDate >= new Date(`${dateRange.start}T00:00:00`);
      const matchesEnd = !dateRange.end || entryDate <= new Date(`${dateRange.end}T23:59:59`);
      return matchesStatus && matchesStart && matchesEnd;
    });
  }, [dateRange.end, dateRange.start, history, statusFilter]);

  const notificationsForUser = useMemo(
    () =>
      notifications.filter(
        (note) => note.role === "all" || note.role === "employee"
      ),
    [notifications]
  );

  const unreadNotifications = notificationsForUser.filter((note) => !note.read).length;

  if (!currentUser) {
    return (
      <AppShell title="Employee portal">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6 text-sm text-zinc-300">
          <p className="text-lg font-semibold text-white">Please sign in</p>
          <p className="mt-2">You need to login as an employee to view your attendance history.</p>
        </div>
      </AppShell>
    );
  }

  if (currentUser.role !== "employee") {
    return (
      <AppShell title="Employee portal">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6 text-sm text-zinc-300">
          <p className="text-lg font-semibold text-white">Access denied</p>
          <p className="mt-2">Only employees have access to this personal overview.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Employee portal"
      sidebarItems={employeeSidebarItems}
      headerActions={employeeHeaderActions}
    >
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Present days</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">{presentDays}</p>
          <p className="text-xs text-zinc-500">Total recorded days</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Late records</p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">{lateDays}</p>
          <p className="text-xs text-zinc-500">Analyze your punctuality</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Today</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {todaysEntry?.status ?? "No record"}
          </p>
          <p className="text-xs text-zinc-500">{today}</p>
        </div>
      </section>

      <section id="check-in" className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-white">Check in / Check out</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => markCheckIn(currentUser.id)}
              disabled={hasCheckedIn}
              className="rounded-full border border-amber-300/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300 disabled:opacity-40"
            >
              {hasCheckedIn ? "Checked in" : "Check in"}
            </button>
            <button
              onClick={() => markCheckOut(currentUser.id)}
              disabled={!hasCheckedIn || hasCheckedOut}
              className="rounded-full border border-emerald-300/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300 disabled:opacity-40"
            >
              {hasCheckedOut ? "Checked out" : "Check out"}
            </button>
          </div>
        </div>
        <p className="text-xs text-zinc-400">
          Times are recorded locally and immediately reflected across the dashboard so your admin sees the update.
        </p>
      </section>

      <section id="history" className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Attendance history</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Filter by status or date</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
            <span>{filteredHistory.length} records</span>
            <span>{statusFilter.toUpperCase()}</span>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap gap-2">
            {(["all", "present", "late", "absent"] as const).map((status) => (
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
          {filteredHistory.length === 0 && (
            <p className="py-4 text-xs text-zinc-400">No records match the filters.</p>
          )}
          {filteredHistory.slice(0, 6).map((entry) => (
            <div key={entry.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
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
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div id="profile" className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Profile settings</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Update shift or department</p>
            </div>
            <span className="text-xs text-zinc-400">{prefersSummary ? "Summary emails on" : "Summary emails off"}</span>
          </div>
          <form
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              if (employeeRecord) {
                updateEmployee(employeeRecord.id, {
                  department: profileForm.department,
                  shift: profileForm.shift,
                });
                setProfileOverrides({});
              }
            }}
            className="mt-4 space-y-3 text-sm"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">Name</label>
              <p className="text-white">{currentUser.name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">Email</label>
              <p className="text-white">{currentUser.email}</p>
            </div>
            <input
              value={profileForm.department}
              onChange={(event) =>
                setProfileOverrides((prev) => ({ ...prev, department: event.target.value }))
              }
              placeholder="Department"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              required
            />
            <input
              value={profileForm.shift}
              onChange={(event) =>
                setProfileOverrides((prev) => ({ ...prev, shift: event.target.value }))
              }
              placeholder="Shift start"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              required
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={prefersSummary}
                  onChange={(event) => setPrefersSummary(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-black/40"
                />
                <span>Receive weekly summary</span>
              </label>
              <button
                type="submit"
                className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-900"
              >
                Save
              </button>
            </div>
          </form>
        </div>
        <div id="notifications" className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">{unreadNotifications} unread</p>
            </div>
            <button
              onClick={() =>
                sendNotification({
                  title: "Employee check-in reminder",
                  message: "Don’t forget to log your check-out before leaving.",
                  role: "employee",
                })
              }
              className="rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
            >
              Send sample
            </button>
          </div>
          <div className="mt-4 divide-y divide-white/5 text-sm">
            {notificationsForUser.map((note) => (
              <div key={note.id} className="flex flex-col gap-1 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{note.title}</p>
                  {!note.read && (
                    <button
                      onClick={() => markNotificationRead(note.id)}
                      className="text-amber-300 text-[10px] uppercase tracking-[0.3em]"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="text-xs text-zinc-400">{note.message}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
