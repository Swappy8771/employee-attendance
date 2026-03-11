"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useData } from "@/context/data-context";

const emptyForm = {
  id: "",
  name: "",
  email: "",
  department: "",
  shift: "09:00",
};

type FormState = typeof emptyForm;

export default function AdminEmployeesPage() {
  const { employees, createEmployee, updateEmployee, toggleEmployeeStatus } = useData();
  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const departments = useMemo(
    () => Array.from(new Set(employees.map((employee) => employee.department))),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((employee) => employee.role === "employee")
      .filter((employee) => (departmentFilter ? employee.department === departmentFilter : true))
      .filter((employee) => (statusFilter ? employee.status === statusFilter : true))
      .filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
  }, [employees, departmentFilter, statusFilter, searchTerm]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formState.id) {
      updateEmployee(formState.id, {
        name: formState.name,
        email: formState.email,
        department: formState.department,
        shift: formState.shift,
      });
    } else {
      createEmployee({
        name: formState.name,
        email: formState.email,
        department: formState.department,
        shift: formState.shift,
      });
    }
    setFormState(emptyForm);
  };

  const handleEdit = (employee: typeof employees[number]) => {
    setFormState({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      shift: employee.shift,
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.5em] text-amber-300">Employee management</p>
            <h2 className="text-2xl font-semibold text-white">Add & update roster</h2>
            <p className="text-sm text-zinc-400">
              Keep employee records current with departments, shifts, and contact info.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-full border border-white/20 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white"
              onClick={() => setFormState(emptyForm)}
            >
              New entry
            </button>
            <button
              type="button"
              className="rounded-full bg-amber-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-900 shadow-[0_10px_25px_rgba(250,204,21,0.4)]"
              onClick={() => setFormState(emptyForm)}
            >
              Reset form
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            value={formState.name}
            onChange={(event) => setFormState({ ...formState, name: event.target.value })}
            placeholder="Full name"
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white shadow-inner"
            required
          />
          <input
            value={formState.email}
            onChange={(event) => setFormState({ ...formState, email: event.target.value })}
            placeholder="Email"
            type="email"
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white shadow-inner"
            required
          />
          <input
            value={formState.department}
            onChange={(event) => setFormState({ ...formState, department: event.target.value })}
            placeholder="Department"
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white shadow-inner"
            required
          />
          <input
            value={formState.shift}
            onChange={(event) => setFormState({ ...formState, shift: event.target.value })}
            placeholder="Shift start (HH:mm)"
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white shadow-inner"
            required
          />
          <div className="flex items-center gap-3 md:col-span-2">
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900 shadow-[0_15px_30px_rgba(250,204,21,0.35)]"
            >
              {formState.id ? "Save employee" : "Add employee"}
            </button>
            {formState.id && (
              <button
                type="button"
                onClick={() => setFormState(emptyForm)}
                className="flex-1 rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
              >
                Cancel update
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-400">Filtered roster</p>
            <h3 className="text-xl font-semibold text-white">Live directory</h3>
          </div>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-zinc-400">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search name"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white shadow-inner"
            />
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white shadow-inner"
            >
              <option value="">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white shadow-inner"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-white/5 text-sm">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-black/40 px-4 py-4 transition hover:border-white/30 hover:bg-white/5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-white">{employee.name}</p>
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                  {employee.department} • {employee.designation}
                </p>
                <p className="text-xs text-zinc-500">
                  Shift • <span className="text-amber-300">{employee.shift}</span>
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 text-xs text-zinc-400 md:items-end">
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-300">
                  {employee.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleEmployeeStatus(employee.id)}
                    className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white"
                  >
                    {employee.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <p className="py-6 text-center text-xs text-zinc-400">
              No employees match the current filters.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
