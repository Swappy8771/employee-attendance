"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import type { AttendanceEntry } from "@/data/mockAttendance";
import type { Employee } from "@/data/mockEmployees";
import type { Notification, NotificationCategory } from "@/data/notifications";
import {
  createEmployee as apiCreateEmployee,
  getAttendance,
  getEmployees,
  getNotifications,
  markCheckIn as apiMarkCheckIn,
  markCheckOut as apiMarkCheckOut,
  markNotificationRead as apiMarkNotificationRead,
  sendNotification as apiSendNotification,
  toggleEmployeeStatus as apiToggleEmployeeStatus,
  updateEmployee as apiUpdateEmployee,
} from "@/services/api";

const ISO_TODAY = () => new Date().toISOString().split("T")[0];

type ActivityLog = {
  id: string;
  message: string;
  timestamp: string;
};

const initialActivityLogs: ActivityLog[] = [
  {
    id: "act-1",
    message: "Rahul Sharma checked in at 09:05",
    timestamp: new Date().toISOString(),
  },
  {
    id: "act-2",
    message: "Priya Patil checked out at 18:10",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "act-3",
    message: "Admin created employee Sneha Joshi",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "act-4",
    message: "Notification sent to employees: Daily roll call ready",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
];


type DataContextValue = {
  employees: Employee[];
  attendance: AttendanceEntry[];
  todaysAttendance: AttendanceEntry[];
  activityLogs: ActivityLog[];
  getAttendanceForEmployee: (employeeId: string) => AttendanceEntry[];
  markCheckIn: (employeeId: string) => void;
  markCheckOut: (employeeId: string) => void;
  createEmployee: (payload: {
    name: string;
    email: string;
    department: string;
    shift: string;
    designation?: string;
    phone?: string;
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
    category: NotificationCategory;
  }) => void;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  const getEmployeeName = (employeeId: string) =>
    employees.find((employee) => employee.id === employeeId)?.name ?? "Team member";

  const logActivity = useCallback((message: string) => {
    const entry: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      message,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [entry, ...prev]);
  }, []);

  const upsertAttendance = useCallback((entry: AttendanceEntry) => {
    setAttendance((prev) => {
      const filtered = prev.filter(
        (item) => !(item.employeeId === entry.employeeId && item.date === entry.date)
      );
      return [...filtered, entry];
    });
  }, []);

  const todaysAttendance = useMemo(
    () => attendance.filter((entry) => entry.date === ISO_TODAY()),
    [attendance]
  );

  const getAttendanceForEmployee = useCallback(
    (employeeId: string) => attendance.filter((entry) => entry.employeeId === employeeId),
    [attendance]
  );

  const loadInitialData = useCallback(async () => {
    try {
      const [employeeData, attendanceData, notificationData] = await Promise.all([
        getEmployees(),
        getAttendance(),
        getNotifications(),
      ]);
      setEmployees(employeeData);
      setAttendance(attendanceData);
      setNotifications(notificationData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load demo data.";
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadInitialData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadInitialData]);

  const markCheckIn = async (employeeId: string) => {
    try {
      const entry = await apiMarkCheckIn(employeeId);
      upsertAttendance(entry);
      logActivity(`${getEmployeeName(employeeId)} checked in at ${entry.checkIn ?? "--"}`);
      toast.success("Check-in recorded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to record check-in");
    }
  };

  const markCheckOut = async (employeeId: string) => {
    try {
      const entry = await apiMarkCheckOut(employeeId);
      upsertAttendance(entry);
      logActivity(`${getEmployeeName(employeeId)} checked out at ${entry.checkOut ?? "--"}`);
      toast.success("Check-out recorded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to record check-out");
    }
  };

  const createEmployee = async (payload: {
    name: string;
    email: string;
    department: string;
    shift: string;
    designation?: string;
    phone?: string;
    role?: Employee["role"];
  }) => {
    try {
      const employee = await apiCreateEmployee({
        ...payload,
        role: payload.role ?? "employee",
      });
      setEmployees((prev) => [employee, ...prev]);
      logActivity(`Admin created employee ${employee.name}`);
      toast.success("Employee added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create employee");
    }
  };

  const updateEmployee = async (id: string, payload: Partial<Omit<Employee, "id">>) => {
    try {
      const employee = await apiUpdateEmployee(id, payload);
      setEmployees((prev) => prev.map((item) => (item.id === id ? employee : item)));
      toast.success("Employee updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const toggleEmployeeStatus = async (id: string) => {
    try {
      const employee = await apiToggleEmployeeStatus(id);
      setEmployees((prev) => prev.map((item) => (item.id === id ? employee : item)));
      toast.success("Status toggled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      const note = await apiMarkNotificationRead(id);
      setNotifications((prev) => prev.map((item) => (item.id === id ? note : item)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to mark notification");
    }
  };

  const sendNotification = async (payload: {
    title: string;
    message: string;
    role: Notification["role"];
    category: NotificationCategory;
  }) => {
    try {
      const note = await apiSendNotification(payload);
      setNotifications((prev) => [note, ...prev]);
      toast.success("Notification delivered");
      const target = payload.role === "all" ? "everyone" : `${payload.role}s`;
      logActivity(`Notification sent to ${target}: ${payload.title}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send notification");
    }
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
        activityLogs,
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
