"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { FormEvent } from "react";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";

export default function EmployeeProfilePage() {
  const { currentUser } = useAuth();
  const { employees, updateEmployee } = useData();

  const employeeRecord = useMemo(
    () => employees.find((employee) => employee.id === currentUser?.id),
    [currentUser, employees]
  );

  const [form, setForm] = useState({
    department: employeeRecord?.department ?? "",
    shift: employeeRecord?.shift ?? "",
  });

  if (!currentUser || !employeeRecord) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateEmployee(employeeRecord.id, {
      department: form.department,
      shift: form.shift,
    });
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/10">
              <Image
                src={employeeRecord.avatar}
                alt={`${employeeRecord.name} avatar`}
                fill
                sizes="4rem"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{employeeRecord.name}</p>
              <p className="text-sm uppercase tracking-[0.4em] text-amber-300">{employeeRecord.designation}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">{employeeRecord.department}</p>
            </div>
          </div>
          <p className="text-xs text-zinc-400">Joined {new Date(employeeRecord.joinDate).toLocaleDateString()}</p>
        </div>
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Email</p>
            <p className="text-white">{employeeRecord.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Phone</p>
            <p className="text-white">{employeeRecord.phone}</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-sm">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">Department</label>
          <input
            value={form.department}
            onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
            placeholder="Department"
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">Shift start</label>
          <input
            value={form.shift}
            onChange={(event) => setForm((prev) => ({ ...prev, shift: event.target.value }))}
            placeholder="Shift start"
            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-black/40" />
            Prefers weekly summary
          </label>
          <button
            type="submit"
            className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-900"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
