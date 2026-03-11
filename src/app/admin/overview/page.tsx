"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useData } from "@/context/data-context";

const statusTone = {
  present: "text-emerald-300",
  late: "text-amber-300",
  absent: "text-rose-300",
} as const;

const statusColors = {
  present: "#34d399",
  late: "#facc15",
  absent: "#fb7185",
} as const;

const cardVariants = {
  hover: { translateY: -4, scale: 1.02, boxShadow: "0 20px 45px -15px rgba(0,0,0,0.8)" },
} as const;

type Card = {
  label: string;
  value: number | string;
  tone: string;
  helper: string;
};

export default function AdminOverviewPage() {
  const { employees, todaysAttendance, attendance, activityLogs } = useData();

  const employeeRoster = useMemo(
    () => employees.filter((employee) => employee.role === "employee" && employee.status === "active"),
    [employees]
  );

  const attendanceByEmployee = useMemo(
    () => new Map(todaysAttendance.map((entry) => [entry.employeeId, entry.status])),
    [todaysAttendance]
  );

  const presentCount = useMemo(
    () =>
      employeeRoster.filter((employee) => {
        const status = attendanceByEmployee.get(employee.id);
        return status && status !== "absent";
      }).length,
    [attendanceByEmployee, employeeRoster]
  );

  const lateCount = useMemo(
    () => todaysAttendance.filter((entry) => entry.status === "late").length,
    [todaysAttendance]
  );

  const absentCount = useMemo(
    () =>
      employeeRoster.filter((employee) => {
        const status = attendanceByEmployee.get(employee.id);
        return !status || status === "absent";
      }).length,
    [attendanceByEmployee, employeeRoster]
  );

  const cards: Card[] = [
    { label: "Present", value: presentCount, tone: statusTone.present, helper: "Team members checked in" },
    { label: "Late", value: lateCount, tone: statusTone.late, helper: "Marked late today" },
    { label: "Absent", value: absentCount, tone: statusTone.absent, helper: "Missing entries" },
  ];

  const pieData = useMemo(
    () => [
      { name: "Present", value: presentCount, status: "present" },
      { name: "Late", value: lateCount, status: "late" },
      { name: "Absent", value: absentCount, status: "absent" },
    ],
    [presentCount, lateCount, absentCount]
  );

  const weeklyTrend = useMemo(() => {
    const days: { day: string; present: number; late: number; absent: number }[] = [];
    for (let delta = 6; delta >= 0; delta -= 1) {
      const current = new Date();
      current.setHours(0, 0, 0, 0);
      current.setDate(current.getDate() - delta);
      const iso = current.toISOString().split("T")[0];
      const entriesForDay = attendance.filter((entry) => entry.date === iso);
      let present = 0;
      let late = 0;
      let absent = 0;

      employeeRoster.forEach((employee) => {
        const entry = entriesForDay.find((item) => item.employeeId === employee.id);
        const status = (entry?.status ?? "absent") as keyof typeof statusTone;
        if (status === "present") present += 1;
        else if (status === "late") late += 1;
        else absent += 1;
      });

      days.push({
        day: current.toLocaleDateString("en-US", { weekday: "short" }),
        present,
        late,
        absent,
      });
    }

    return days;
  }, [attendance, employeeRoster]);

  const departmentData = useMemo(() => {
    const buckets = new Map<
      string,
      { department: string; present: number; late: number; absent: number }
    >();

    employeeRoster.forEach((employee) => {
      const status = (attendanceByEmployee.get(employee.id) ?? "absent") as keyof typeof statusTone;
      const bucket = buckets.get(employee.department) ?? {
        department: employee.department,
        present: 0,
        late: 0,
        absent: 0,
      };

      if (status === "present") bucket.present += 1;
      else if (status === "late") bucket.late += 1;
      else bucket.absent += 1;

      buckets.set(employee.department, bucket);
    });

    return Array.from(buckets.values());
  }, [employeeRoster, attendanceByEmployee]);

  const recentActivities = useMemo(() => activityLogs.slice(0, 6), [activityLogs]);

  const formatActivityTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <motion.div
            key={card.label}
            className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5"
            whileHover="hover"
            variants={cardVariants}
            initial="rest"
            animate="rest"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">{card.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${card.tone}`}>{card.value}</p>
            <p className="text-xs text-zinc-500">{card.helper}</p>
          </motion.div>
        ))}
      </div>
      <motion.div className="grid gap-6 lg:grid-cols-[1fr_1fr]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <motion.div whileHover={{ translateY: -6 }} className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Present today</p>
          <p className="text-sm text-zinc-200">Live breakdown of attendance statuses</p>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={statusColors[entry.status as keyof typeof statusColors]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} employees`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div whileHover={{ translateY: -6 }} className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Weekly attendance trend</p>
          <p className="text-sm text-zinc-200">Shows how the team has checked in over the last 7 days</p>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke={statusColors.present} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="late" stroke={statusColors.late} strokeDasharray="4 2" dot={false} />
                <Line type="monotone" dataKey="absent" stroke={statusColors.absent} strokeDasharray="2 2" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Department attendance</p>
          <p className="text-sm text-zinc-200">Breakdown of today’s status by team</p>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="department" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill={statusColors.present} stackId="a" />
              <Bar dataKey="late" fill={statusColors.late} stackId="a" />
              <Bar dataKey="absent" fill={statusColors.absent} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Recent activities</p>
        <p className="text-sm text-zinc-200">Keep an eye on the latest events in the organization</p>
        <ul className="mt-4 space-y-3 text-sm text-zinc-100">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-zinc-950/40 px-4 py-3">
              <span>{activity.message}</span>
              <span className="text-xs uppercase tracking-[0.4em] text-zinc-500">{formatActivityTime(activity.timestamp)}</span>
            </li>
          ))}
          {recentActivities.length === 0 && (
            <li className="text-xs text-zinc-500">No activity yet—interact with the portal to seed events.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
