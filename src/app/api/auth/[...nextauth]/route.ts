import type { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { mockEmployees, mockUserRecords } from "@/data/mockEmployees";

const secret = process.env.NEXTAUTH_SECRET ?? "development-secret";

export const authOptions: AuthOptions = {
  secret,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const normalized = credentials.email.trim().toLowerCase();
        const employee = mockEmployees.find((item) => item.email.toLowerCase() === normalized);

        if (!employee) {
          return null;
        }

        const record = mockUserRecords.find((item) => item.employeeId === employee.id);

        if (!record || record.password !== credentials.password) {
          return null;
        }

        return {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: record.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt(params) {
      const { token, user } = params;
      if (user) {
        (token as JWT & { role?: string; id?: string }).role = user.role;
        (token as JWT & { role?: string; id?: string }).id = user.id;
      }
      return token;
    },
    async session(params) {
      const { session, token } = params;
      if (session.user) {
        session.user.id = (token as JWT & { id?: string }).id as string;
        session.user.role = (token as JWT & { role?: string }).role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
