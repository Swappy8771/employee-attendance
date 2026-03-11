export type AttendanceStatus = "present" | "absent" | "late";

export type AttendanceEntry = {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
};

import { mockEmployees } from "./mockEmployees";

const formatTime = (hour: number, minute: number) =>
  `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

const pseudoRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash % 100);
};

const getAttendanceStatus = (checkIn?: string): AttendanceStatus => {
  if (!checkIn) return "absent";
  return checkIn > "09:15" ? "late" : "present";
};

const generateAttendance = (): AttendanceEntry[] => {
  const entries: AttendanceEntry[] = [];
  const today = new Date();
  const employees = mockEmployees.filter((employee) => employee.role === "employee");

  for (let delta = 0; delta < 30; delta += 1) {
    const current = new Date(today.getTime());
    current.setDate(current.getDate() - delta);
    const iso = current.toISOString().split("T")[0];

    employees.forEach((employee) => {
      const seed = `${employee.id}:${iso}`;
      const rand = pseudoRandom(seed);
      let checkIn: string | undefined;
      let checkOut: string | undefined;

      if (rand < 65) {
        const hour = 8 + (rand % 2);
        const minute = hour === 8 ? 10 + (rand % 50) : 5 + (rand % 10);
        checkIn = formatTime(hour, minute);
        const outHour = 16 + (rand % 3);
        const outMinute = 30 + (rand % 30);
        checkOut = formatTime(outHour, outMinute);
      } else if (rand < 85) {
        const minute = 15 + (rand % 40);
        checkIn = formatTime(9, minute);
        const outHour = 17 + (rand % 2);
        const outMinute = 15 + (rand % 30);
        checkOut = formatTime(outHour, outMinute);
      }

      entries.push({
        id: `att-${employee.id}-${iso}`,
        employeeId: employee.id,
        date: iso,
        status: getAttendanceStatus(checkIn),
        checkIn,
        checkOut,
      });
    });
  }

  return entries;
};

export const mockAttendance = generateAttendance();
