"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";

const adminSidebarItems = [
  { label: "Overview", href: "/admin#overview" },
  { label: "Attendance", href: "/admin#attendance" },
  { label: "Employees", href: "/admin#employees" },
  { label: "Reporting", href: "/admin#reporting" },
  { label: "Notifications", href: "/admin#notifications" },
];

const adminHeaderActions = (
  <>
    <button className="rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.4em] text-white">
      Invite team
    </button>
    <button className="rounded-full bg-amber-400 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-900">
      Export view
    </button>
  </>
);

const statusTone = {
  present: "text-emerald-300",
  late: "text-amber-300",
  absent: "text-rose-300",
};

type StatusKey = keyof typeof statusTone;

const emptyForm = {
  id: "",
  name: "",
  email: "",
  department: "",
  shift: "09:00",
  role: "employee" as const,
};

type FormState = typeof emptyForm;

export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const {
    employees,
    todaysAttendance,
    attendance,
    markCheckIn,
    markCheckOut,
    createEmployee,
    updateEmployee,
    toggleEmployeeStatus,
    notifications,
    markNotificationRead,
    sendNotification,
  } = useData();

  const [formState, setFormState] = useState<FormState>(emptyForm);

  const employeeRoster = useMemo(
    () => employees.filter((employee) => employee.role === "employee" && employee.status === "active"),
    [employees]
  );

  const attendanceByEmployee = useMemo(
    () => new Map(todaysAttendance.map((entry) => [entry.employeeId, entry])),
    [todaysAttendance]
  );

  const presentCount = employeeRoster.filter((employee) => {
    const entry = attendanceByEmployee.get(employee.id);
    return entry?.checkIn && entry.status !== "absent";
  }).length;

  const lateCount = todaysAttendance.filter((entry) => entry.status === "late").length;
  const absentCount = employeeRoster.filter((employee) => {
    const entry = attendanceByEmployee.get(employee.id);
    return !entry || entry.status === "absent";
  }).length;

  const totalUniqueDates = useMemo(
    () => new Set(attendance.map((entry) => entry.date)).size || 1,
    [attendance]
  );

  const reportingMetrics = useMemo(() => {
    const presentEntries = attendance.filter((entry) => entry.status !== "absent").length;
    const lateEntries = attendance.filter((entry) => entry.status === "late").length;
    const absences = attendance.filter((entry) => entry.status === "absent").length;
    const averagePresentPerDay = Math.round((presentEntries / totalUniqueDates) * 100) / 100;

    return [
      {
        label: "Average present/day",
        value: averagePresentPerDay.toFixed(2),
        tone: "text-emerald-400",
        helper: `${presentEntries} total present records`,
      },
      {
        label: "Late records",
        value: lateEntries,
        tone: "text-amber-400",
        helper: "Check-in after 9:15 counts as late",
      },
      {
        label: "Absences",
        value: absences,
        tone: "text-rose-400",
        helper: "Includes days without check-in",
      },
      {
        label: "Active employees",
        value: employeeRoster.length,
        tone: "text-white",
        helper: "Ready for today",
      },
    ];
  }, [attendance, employeeRoster.length, totalUniqueDates]);

  const handleEdit = (employee: (typeof employees)[number]) => {
    setFormState({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      shift: employee.shift,
      role: employee.role,
    });
  };

  if (!currentUser) {
    return (
      <AppShell title="Admin dashboard">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 text-sm text-zinc-300">
          <p className="text-lg font-semibold text-white">Please sign in</p>
          <p className="mt-2">Head to the login screen to access admin tools.</p>
        </div>
      </AppShell>
    );
  }

  if (currentUser.role !== "admin") {
    return (
      <AppShell title="Admin dashboard">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 text-sm text-zinc-300">
          <p className="text-lg font-semibold text-white">Access denied</p>
          <p className="mt-2">This area is reserved for admins. Please sign in with an admin account.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Admin dashboard"
      sidebarItems={adminSidebarItems}
      headerActions={adminHeaderActions}
    >
      <section id="overview" className="grid gap-6 md:grid-cols-3">
        {[{
          label: "Present",
          value: presentCount,
          tone: "text-emerald-400",
        },
        {
          label: "Late",
          value: lateCount,
          tone: "text-amber-400",
        },
        {
          label: "Absent",
          value: absentCount,
          tone: "text-rose-400",
        }].map((card) => (
          <div
            key={card.label}
            className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">{card.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${card.tone}`}>{card.value}</p>
            <p className="text-xs text-zinc-500">updated just now</p>
          </div>
        ))}
      </section>

      <section id="attendance" className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Attendance today</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Check-in / check-out overrides
            </p>
          </div>
          <span className="text-xs text-zinc-400">{employeeRoster.length} active employees</span>
        </div>
        <div className="mt-4 space-y-3">
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
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => markCheckIn(employee.id)}
                    disabled={Boolean(entry?.checkIn)}
                    className="rounded-2xl border border-amber-300/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300 disabled:opacity-30"
                  >
                    Check in
                  </button>
                  <button
                    onClick={() => markCheckOut(employee.id)}
                    disabled={!entry?.checkIn || Boolean(entry?.checkOut)}
                    className="rounded-2xl border border-emerald-300/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300 disabled:opacity-30"
                  >
                    Check out
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="employees" className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Employees</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              CRUD, toggle status, or update shift data.
            </p>
          </div>
          <p className="text-xs text-zinc-400">{employees.length} total profiles</p>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-zinc-950/50 p-4 shadow-inner">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (formState.id) {
                  updateEmployee(formState.id, {
                    name: formState.name,
                    email: formState.email,
                    department: formState.department,
                    shift: formState.shift,
                  });
                } else {
                  createEmployee({
                    name: formState.name,
                    email: formState.email,
                    department: formState.department,
                    shift: formState.shift,
                  });
                }
                setFormState(emptyForm);
              }}
            >
              <div className="grid gap-3">
                <input
                  value={formState.name}
                  onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                  placeholder="Full name"
                  className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  required
                />
                <input
                  value={formState.email}
                  onChange={(event) => setFormState({ ...formState, email: event.target.value })}
                  placeholder="Email"
                  type="email"
                  className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  required
                />
                <input
                  value={formState.department}
                  onChange={(event) =>
                    setFormState({ ...formState, department: event.target.value })
                  }
                  placeholder="Department"
                  className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  required
                />
                <input
                  value={formState.shift}
                  onChange={(event) => setFormState({ ...formState, shift: event.target.value })}
                  placeholder="Shift start (HH:mm)"
                  className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase text-zinc-900"
                  >
                    {formState.id ? "Save changes" : "Add employee"}
                  </button>
                  {formState.id && (
                    <button
                      type="button"
                      onClick={() => setFormState(emptyForm)}
                      className="flex-1 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase text-white"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="rounded-2xl border border-white/5 bg-zinc-950/50 p-4 shadow-inner">
            <div className="divide-y divide-white/5 text-sm">
              {employees
                .filter((employee) => employee.role === "employee")
                .map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-semibold text-white">{employee.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                        {employee.department} • {employee.shift}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xs text-zinc-400">{employee.status}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleEmployeeStatus(employee.id)}
                          className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
                        >
                          {employee.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section id="reporting" className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Reporting</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Visualize attendance trends from your mock data.
            </p>
          </div>
          <span className="text-xs text-zinc-400">Updated just now</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {reportingMetrics.map((metric) => (
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
      </section>

      <section id="notifications" className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Share quick updates with your admins and employees.
            </p>
          </div>
          <button
            onClick={() =>
              sendNotification({
                title: "Mid-week reminder",
                message: "Please double-check your check-out if you leave early.",
                role: "all",
              })
            }
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]"
          >
            Send test notification
          </button>
        </div>
        <div className="mt-4 divide-y divide-white/5">
          {notifications
            .filter((note) => note.role === "admin" || note.role === "all")
            .map((note) => (
              <div
                key={note.id}
                className="flex flex-col gap-1 py-3 text-sm text-zinc-300 md:flex-row md:items-start md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-white">{note.title}</p>
                  <p className="text-xs text-zinc-400">{note.message}</p>
                </div>
                <div className="flex gap-2 text-xs uppercase tracking-[0.3em] text-amber-300">
                  {!note.read && (
                    <button onClick={() => markNotificationRead(note.id)} className="text-amber-300">
                      Mark read
                    </button>
                  )}
                  <span>{new Date(note.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
        </div>
      </section>
    </AppShell>
  );
}
