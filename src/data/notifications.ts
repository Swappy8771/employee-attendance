export type NotificationCategory = "announcement" | "alert" | "reminder";

export type Notification = {
  id: string;
  title: string;
  message: string;
  role: "admin" | "employee" | "all";
  category: NotificationCategory;
  read: boolean;
  createdAt: string;
};

export const initialNotifications: Notification[] = [
  {
    id: "note-1",
    title: "Daily roll call ready",
    message: "Attendance data for today is waiting for your review.",
    role: "admin",
    category: "reminder",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "note-2",
    title: "Late alert",
    message: "Rohit marked late today; make sure his file is updated.",
    role: "admin",
    category: "alert",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "note-3",
    title: "Welcome to PulseDesk",
    message: "Check-in/out history is already recording from yesterday.",
    role: "employee",
    category: "announcement",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "note-4",
    title: "Office closed tomorrow",
    message: "Weather alert: we are shutting the office for safety.",
    role: "all",
    category: "announcement",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "note-5",
    title: "Attendance reminder",
    message: "Please remember to check out before you leave today.",
    role: "employee",
    category: "reminder",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];
