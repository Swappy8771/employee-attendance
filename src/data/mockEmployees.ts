export type EmployeeRole = "admin" | "employee";

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  role: EmployeeRole;
  shift: string;
  joinDate: string;
  status: "active" | "inactive";
  phone: string;
  avatar: string;
};

const today = new Date();
const formatJoinDate = (offsetMonths: number) => {
  const date = new Date(today.getTime());
  date.setMonth(date.getMonth() - offsetMonths);
  return date.toISOString().split("T")[0];
};

export const buildAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1f2937&color=ffffff&rounded=true`;

export const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "Sasha Adams",
    email: "sasha@pulsedesk.com",
    department: "People Ops",
    designation: "Chief People Officer",
    role: "admin",
    shift: "09:00",
    joinDate: formatJoinDate(36),
    status: "active",
    phone: "+1 (415) 555-0134",
    avatar: buildAvatarUrl("Sasha Adams"),
  },
  {
    id: "emp-2",
    name: "Rahul Sharma",
    email: "rahul@pulsedesk.com",
    department: "Operations",
    designation: "Operations Lead",
    role: "employee",
    shift: "08:30",
    joinDate: formatJoinDate(18),
    status: "active",
    phone: "+1 (415) 555-0100",
    avatar: buildAvatarUrl("Rahul Sharma"),
  },
  {
    id: "emp-3",
    name: "Priya Patil",
    email: "priya@pulsedesk.com",
    department: "Customer Care",
    designation: "Customer Experience Manager",
    role: "employee",
    shift: "09:00",
    joinDate: formatJoinDate(24),
    status: "active",
    phone: "+1 (415) 555-0111",
    avatar: buildAvatarUrl("Priya Patil"),
  },
  {
    id: "emp-4",
    name: "Amit Verma",
    email: "amit@pulsedesk.com",
    department: "Field",
    designation: "Field Operations Specialist",
    role: "employee",
    shift: "07:45",
    joinDate: formatJoinDate(10),
    status: "active",
    phone: "+1 (415) 555-0109",
    avatar: buildAvatarUrl("Amit Verma"),
  },
  {
    id: "emp-5",
    name: "Sneha Joshi",
    email: "sneha@pulsedesk.com",
    department: "Finance",
    designation: "Payroll Analyst",
    role: "employee",
    shift: "09:30",
    joinDate: formatJoinDate(16),
    status: "active",
    phone: "+1 (415) 555-0190",
    avatar: buildAvatarUrl("Sneha Joshi"),
  },
  {
    id: "emp-6",
    name: "Nisha Kapoor",
    email: "nisha@pulsedesk.com",
    department: "Product",
    designation: "Product Analyst",
    role: "employee",
    shift: "10:00",
    joinDate: formatJoinDate(12),
    status: "active",
    phone: "+1 (415) 555-0113",
    avatar: buildAvatarUrl("Nisha Kapoor"),
  },
  {
    id: "emp-7",
    name: "Jose Ramirez",
    email: "jose@pulsedesk.com",
    department: "Logistics",
    designation: "Route Coordinator",
    role: "employee",
    shift: "08:45",
    joinDate: formatJoinDate(14),
    status: "active",
    phone: "+1 (415) 555-0177",
    avatar: buildAvatarUrl("Jose Ramirez"),
  },
  {
    id: "emp-8",
    name: "Simran Malik",
    email: "simran@pulsedesk.com",
    department: "Customer Care",
    designation: "Team Lead",
    role: "employee",
    shift: "10:00",
    joinDate: formatJoinDate(20),
    status: "active",
    phone: "+1 (415) 555-0182",
    avatar: buildAvatarUrl("Simran Malik"),
  },
  {
    id: "emp-9",
    name: "Daniel O'Neil",
    email: "daniel@pulsedesk.com",
    department: "Field",
    designation: "Field Engineer",
    role: "employee",
    shift: "08:15",
    joinDate: formatJoinDate(8),
    status: "active",
    phone: "+1 (415) 555-0144",
    avatar: buildAvatarUrl("Daniel O'Neil"),
  },
  {
    id: "emp-10",
    name: "Lila Gomez",
    email: "lila@pulsedesk.com",
    department: "Finance",
    designation: "Billing Specialist",
    role: "employee",
    shift: "09:00",
    joinDate: formatJoinDate(6),
    status: "active",
    phone: "+1 (415) 555-0166",
    avatar: buildAvatarUrl("Lila Gomez"),
  },
  {
    id: "emp-11",
    name: "Aaron Cole",
    email: "aaron@pulsedesk.com",
    department: "Operations",
    designation: "Supply Chain Analyst",
    role: "employee",
    shift: "08:30",
    joinDate: formatJoinDate(5),
    status: "inactive",
    phone: "+1 (415) 555-0120",
    avatar: buildAvatarUrl("Aaron Cole"),
  },
  {
    id: "emp-12",
    name: "Maya Singh",
    email: "maya@pulsedesk.com",
    department: "People Ops",
    designation: "Talent Partner",
    role: "employee",
    shift: "09:00",
    joinDate: formatJoinDate(22),
    status: "active",
    phone: "+1 (415) 555-0110",
    avatar: buildAvatarUrl("Maya Singh"),
  },
];

export type UserRecord = {
  employeeId: string;
  password: string;
  role: EmployeeRole;
};

export const mockUserRecords: UserRecord[] = mockEmployees.map((employee) => ({
  employeeId: employee.id,
  password: employee.role === "admin" ? "admin123" : "employee123",
  role: employee.role,
}));
