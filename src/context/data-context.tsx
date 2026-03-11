"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { AttendanceEntry, AttendanceStatus } from "@/data/mockAttendance";
import { mockAttendance } from "@/data/mockAttendance";
import type { Employee } from "@/data/mockEmployees";
import { mockEmployees } from "@/data/mockEmployees";

const ISO_TODAY = () => new Date().toISOString().split("T")[0];
const clockInText = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const deriveStatus = (checkIn?: string): AttendanceStatus => {
  if (!checkIn) return "absent";
  const [hours, minutes] = checkIn.split(":").map(Number);
  if (hours > 9 || (hours === 9 && minutes > 15)) {
    return "late";
  }
  return "present";
};

type Notification = {
  id: string;
  title: string;
  message: string;
  role: "admin" | "employee" | "all";
  read: boolean;
  createdAt: string;
};

const sharedNotifications: Notification[] = [
  {
    id: "note-1",
    title: "Daily roll call ready",
    message: "Attendance data for today is waiting for your review.",
    role: "admin",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "note-2",
    title: "Late alert",
    message: "Rohit marked late today; make sure his file is updated.",
    role: "admin",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "note-3",
    title: "Welcome to PulseDesk",
    message: "Check-in/out history is already recording from yesterday.",
    role: "employee",
    read: false,
    createdAt: new Date().toISOString(),
  },
];

type DataContextValue = {
  employees: Employee[];
  attendance: AttendanceEntry[];
  todaysAttendance: AttendanceEntry[];
  getAttendanceForEmployee: (employeeId: string) => AttendanceEntry[];
  markCheckIn: (employeeId: string) => void;
  markCheckOut: (employeeId: string) => void;
  createEmployee: (payload: {
    name: string;
    email: string;
    department: string;
    shift: string;
    role?: Employee["role"];
  }) => void;
  updateEmployee: (id: string, payload: Partial<Omit<Employee, "id">>) => void;
  toggleEmployeeStatus: (id: string) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  sendNotification: (payload: {
    title: string;
    message: string;
    role: Notification["role"];
  }) => void;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [attendance, setAttendance] = useState<AttendanceEntry[]>(mockAttendance);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [notifications, setNotifications] = useState<Notification[]>(sharedNotifications);

  const markCheckIn = (employeeId: string) => {
    const today = ISO_TODAY();
    const time = clockInText();

    setAttendance((prev) => {
      const index = prev.findIndex(
        (entry) => entry.employeeId === employeeId && entry.date === today
      );

      if (index > -1) {
        const entry = prev[index];
        const updated: AttendanceEntry = {
          ...entry,
          checkIn: entry.checkIn ?? time,
          status: deriveStatus(entry.checkIn ?? time),
        };
        const copy = [...prev];
        copy[index] = updated;
        return copy;
      }

      const newEntry: AttendanceEntry = {
        id: `att-${employeeId}-${Date.now()}`,
        employeeId,
        date: today,
        checkIn: time,
        status: deriveStatus(time),
      };

      return [...prev, newEntry];
    });
  };

  const markCheckOut = (employeeId: string) => {
    const today = ISO_TODAY();
    const time = clockInText();

    setAttendance((prev) => {
      const index = prev.findIndex(
        (entry) => entry.employeeId === employeeId && entry.date === today
      );

      if (index > -1) {
        const entry = prev[index];
        const updated: AttendanceEntry = {
          ...entry,
          checkOut: time,
          status: deriveStatus(entry.checkIn),
        };
        const copy = [...prev];
        copy[index] = updated;
        return copy;
      }

      const newEntry: AttendanceEntry = {
        id: `att-${employeeId}-${Date.now()}`,
        employeeId,
        date: today,
        checkOut: time,
        status: "absent",
      };

      return [...prev, newEntry];
    });
  };

  const todaysAttendance = useMemo(
    () => attendance.filter((entry) => entry.date === ISO_TODAY()),
    [attendance]
  );

  const getAttendanceForEmployee = useCallback(
    (employeeId: string) => attendance.filter((entry) => entry.employeeId === employeeId),
    [attendance]
  );

  const createEmployee = (payload: {
    name: string;
    email: string;
    department: string;
    shift: string;
    role?: Employee["role"];
  }) => {
    setEmployees((prev) => [
      ...prev,
      {
        id: `emp-${Date.now()}`,
        role: payload.role ?? "employee",
        status: "active",
        ...payload,
      },
    ]);
  };

  const updateEmployee = (id: string, payload: Partial<Omit<Employee, "id">>) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              ...payload,
            }
          : employee
      )
    );
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              status: employee.status === "active" ? "inactive" : "active",
            }
          : employee
      )
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((note) => (note.id === id ? { ...note, read: true } : note))
    );
  };

  const sendNotification = (payload: {
    title: string;
    message: string;
    role: Notification["role"];
  }) => {
    setNotifications((prev) => [
      {
        id: `note-${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
        ...payload,
      },
      ...prev,
    ]);
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        attendance,
        todaysAttendance,
        getAttendanceForEmployee,
        markCheckIn,
        markCheckOut,
        createEmployee,
        updateEmployee,
        toggleEmployeeStatus,
        notifications,
        markNotificationRead,
        sendNotification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }

  return context;
}
