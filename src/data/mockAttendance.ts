export type AttendanceStatus = "present" | "absent" | "late";

export type AttendanceEntry = {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
};

const today = new Date();
const formattedToday = today.toISOString().split("T")[0];

export const mockAttendance: AttendanceEntry[] = [
  {
    id: "att-1",
    employeeId: "emp-2",
    date: formattedToday,
    checkIn: "08:50",
    checkOut: "17:05",
    status: "present",
  },
  {
    id: "att-2",
    employeeId: "emp-3",
    date: formattedToday,
    checkIn: "10:05",
    status: "late",
  },
  {
    id: "att-3",
    employeeId: "emp-4",
    date: formattedToday,
    checkIn: "08:28",
    checkOut: "16:55",
    status: "present",
  },
  {
    id: "att-4",
    employeeId: "emp-5",
    date: formattedToday,
    status: "absent",
  },
  {
    id: "att-5",
    employeeId: "emp-2",
    date: new Date(today.getTime() - 86400000).toISOString().split("T")[0],
    checkIn: "08:55",
    checkOut: "17:00",
    status: "present",
  },
];
