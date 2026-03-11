export type EmployeeRole = "admin" | "employee";

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: EmployeeRole;
  shift: string;
  status: "active" | "inactive";
};

export const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "Sasha Adams",
    email: "sid@pulsedesk.com",
    department: "People Ops",
    role: "admin",
    shift: "09:00",
    status: "active",
  },
  {
    id: "emp-2",
    name: "Rohit Nair",
    email: "rohit@pulsedesk.com",
    department: "Operations",
    role: "employee",
    shift: "09:00",
    status: "active",
  },
  {
    id: "emp-3",
    name: "Mia Chen",
    email: "mia@pulsedesk.com",
    department: "Customer Care",
    role: "employee",
    shift: "10:00",
    status: "active",
  },
  {
    id: "emp-4",
    name: "Diego Silveira",
    email: "diego@pulsedesk.com",
    department: "Field",
    role: "employee",
    shift: "08:30",
    status: "active",
  },
  {
    id: "emp-5",
    name: "Lena Foster",
    email: "lena@pulsedesk.com",
    department: "Finance",
    role: "employee",
    shift: "09:00",
    status: "active",
  },
];

export type UserRecord = {
  employeeId: string;
  password: string;
  role: EmployeeRole;
};

export const mockUserRecords: UserRecord[] = [
  { employeeId: "emp-1", password: "admin123", role: "admin" },
  { employeeId: "emp-2", password: "employee123", role: "employee" },
  { employeeId: "emp-3", password: "employee123", role: "employee" },
  { employeeId: "emp-4", password: "employee123", role: "employee" },
  { employeeId: "emp-5", password: "employee123", role: "employee" },
];
