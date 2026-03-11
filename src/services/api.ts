import type { AttendanceEntry } from "@/data/mockAttendance";
import { mockAttendance } from "@/data/mockAttendance";
import type { Employee } from "@/data/mockEmployees";
import { mockEmployees } from "@/data/mockEmployees";
import type { Notification } from "@/data/notifications";
import { initialNotifications } from "@/data/notifications";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const NETWORK_ERROR_RATE = 0.08;

const shouldFail = () => {
  if (Math.random() < NETWORK_ERROR_RATE) {
    throw new Error("Network error – try again");
  }
};

let employeeStore: Employee[] = [...mockEmployees];
let attendanceStore: AttendanceEntry[] = [...mockAttendance];
let notificationStore: Notification[] = [...initialNotifications];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const ensureToday = (): string => new Date().toISOString().split("T")[0];

const entryStatus = (checkIn?: string): AttendanceEntry["status"] => {
  if (!checkIn) return "absent";
  return checkIn > "09:15" ? "late" : "present";
};

export async function getEmployees(): Promise<Employee[]> {
  await delay();
  shouldFail();
  return clone(employeeStore);
}

export async function getAttendance(): Promise<AttendanceEntry[]> {
  await delay();
  shouldFail();
  return clone(attendanceStore);
}

export async function getNotifications(): Promise<Notification[]> {
  await delay();
  shouldFail();
  return clone(notificationStore);
}

export async function markCheckIn(employeeId: string): Promise<AttendanceEntry> {
  await delay(250);
  shouldFail();
  const today = ensureToday();
  const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const index = attendanceStore.findIndex((entry) => entry.employeeId === employeeId && entry.date === today);

  if (index > -1) {
    const entry = attendanceStore[index];
    const updated = { ...entry, checkIn: entry.checkIn ?? now };
    attendanceStore[index] = updated;
    return clone(updated);
  }

  const newEntry: AttendanceEntry = {
    id: `att-${employeeId}-${Date.now()}`,
    employeeId,
    date: today,
    checkIn: now,
    status: entryStatus(now),
  };
  attendanceStore = [...attendanceStore, newEntry];
  return clone(newEntry);
}

export async function markCheckOut(employeeId: string): Promise<AttendanceEntry> {
  await delay(250);
  shouldFail();
  const today = ensureToday();
  const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const index = attendanceStore.findIndex((entry) => entry.employeeId === employeeId && entry.date === today);

  if (index > -1) {
    const entry = attendanceStore[index];
    const updated = { ...entry, checkOut: now };
    attendanceStore[index] = updated;
    return clone(updated);
  }

  const newEntry: AttendanceEntry = {
    id: `att-${employeeId}-${Date.now()}`,
    employeeId,
    date: today,
    checkOut: now,
    status: "absent",
  };
  attendanceStore = [...attendanceStore, newEntry];
  return clone(newEntry);
}

export async function createEmployee(payload: Partial<Employee>): Promise<Employee> {
  await delay(300);
  shouldFail();
  const newEmployee: Employee = {
    id: `emp-${Date.now()}`,
    name: payload.name ?? "New team member",
    email: payload.email ?? "new@pulsedesk.com",
    department: payload.department ?? "Operations",
    designation: payload.designation ?? "Team member",
    role: payload.role ?? "employee",
    shift: payload.shift ?? "09:00",
    joinDate: ensureToday(),
    status: "active",
    phone: payload.phone ?? "+1 (415) 555-0000",
    avatar: payload.avatar ?? "https://ui-avatars.com/api/?name=New+Member",
  };
  employeeStore = [newEmployee, ...employeeStore];
  return clone(newEmployee);
}

export async function updateEmployee(id: string, payload: Partial<Employee>): Promise<Employee> {
  await delay(300);
  shouldFail();
  employeeStore = employeeStore.map((employee) =>
    employee.id === id ? { ...employee, ...payload } : employee
  );
  const updated = employeeStore.find((employee) => employee.id === id);
  if (!updated) throw new Error("Employee not found");
  return clone(updated);
}

export async function toggleEmployeeStatus(id: string): Promise<Employee> {
  await delay(200);
  shouldFail();
  employeeStore = employeeStore.map((employee) =>
    employee.id === id ? { ...employee, status: employee.status === "active" ? "inactive" : "active" } : employee
  );
  const updated = employeeStore.find((employee) => employee.id === id);
  if (!updated) throw new Error("Employee not found");
  return clone(updated);
}

export async function sendNotification(payload: Partial<Notification>): Promise<Notification> {
  await delay(200);
  shouldFail();
  const note: Notification = {
    id: `note-${Date.now()}`,
    title: payload.title ?? "New notification",
    message: payload.message ?? "You've got an update",
    role: payload.role ?? "all",
    category: payload.category ?? "announcement",
    read: false,
    createdAt: new Date().toISOString(),
  };
  notificationStore = [note, ...notificationStore];
  return clone(note);
}

export async function markNotificationRead(id: string): Promise<Notification> {
  await delay(100);
  shouldFail();
  notificationStore = notificationStore.map((note) =>
    note.id === id ? { ...note, read: true } : note
  );
  const updated = notificationStore.find((note) => note.id === id);
  if (!updated) throw new Error("Notification not found");
  return clone(updated);
}
