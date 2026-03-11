"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { NotificationCategory } from "@/data/notifications";
import { useData } from "@/context/data-context";

const categoryLabels: Record<NotificationCategory, { label: string; color: string }> = {
  announcement: { label: "Announcement", color: "text-sky-300" },
  alert: { label: "Alert", color: "text-rose-300" },
  reminder: { label: "Reminder", color: "text-amber-300" },
};

const roleOptions: Array<{ label: string; value: "admin" | "employee" | "all" }> = [
  { label: "All", value: "all" },
  { label: "Admins", value: "admin" },
  { label: "Employees", value: "employee" },
];

export default function AdminNotificationsPage() {
  const { notifications, markNotificationRead, sendNotification } = useData();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<NotificationCategory>("announcement");
  const [role, setRole] = useState<"admin" | "employee" | "all">("all");

  const unread = useMemo(
    () => notifications.filter((note) => !note.read && (note.role === "admin" || note.role === "all")).length,
    [notifications]
  );

  const handleSend = () => {
    if (!title || !message) return;
    sendNotification({ title, message, role, category });
    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Broadcast updates to the team.</p>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-amber-300">{unread} unread</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
        />
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Message"
          className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as NotificationCategory)}
          className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
        >
          <option value="announcement">Announcement</option>
          <option value="alert">Alert</option>
          <option value="reminder">Reminder</option>
        </select>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as "admin" | "employee" | "all")}
          className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSend}
          className="rounded-full bg-amber-400 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-900"
        >
          Send notification
        </button>
      </div>
      <div className="divide-y divide-white/5 text-sm">
        {notifications
          .filter((note) => note.role === "admin" || note.role === "all")
          .map((note) => (
            <motion.div
              key={note.id}
              className="flex flex-col gap-1 py-3 text-zinc-300 md:flex-row md:items-start md:justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -2 }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-white">{note.title}</p>
                  {!note.read && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-300">
                      Unread
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400">{note.message}</p>
                <span className={`text-[10px] uppercase tracking-[0.3em] ${categoryLabels[note.category].color}`}>
                  {categoryLabels[note.category].label}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2 text-xs uppercase tracking-[0.3em] text-amber-300">
                {!note.read && (
                  <button onClick={() => markNotificationRead(note.id)} className="text-amber-300">
                    Mark read
                  </button>
                )}
                <span>{new Date(note.createdAt).toLocaleTimeString()}</span>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
