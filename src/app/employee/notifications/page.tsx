"use client";

import { motion } from "framer-motion";
import { NotificationCategory, useData } from "@/context/data-context";

const categoryAccent: Record<NotificationCategory, string> = {
  announcement: "text-sky-300",
  alert: "text-rose-300",
  reminder: "text-amber-300",
};

export default function EmployeeNotificationsPage() {
  const { notifications, markNotificationRead } = useData();
  const filtered = notifications.filter((note) => note.role === "all" || note.role === "employee");
  const unread = filtered.filter((note) => !note.read).length;

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300">🔔 Notifications</p>
          <h2 className="text-xl font-semibold text-white">Stay informed</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">{unread} unread</p>
        </div>
      </div>
      <div className="mt-6 space-y-3 text-sm">
        {filtered.map((note) => (
          <motion.div
            key={note.id}
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-inner"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-white">{note.title}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase tracking-[0.3em] ${categoryAccent[note.category]}`}>
                  {note.category}
                </span>
                {!note.read && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-300">
                    Unread
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-zinc-300">{note.message}</p>
            {!note.read && (
              <button
                onClick={() => markNotificationRead(note.id)}
                className="text-amber-300 text-[10px] uppercase tracking-[0.3em]"
              >
                Mark read
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
