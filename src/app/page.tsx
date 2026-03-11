"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

const features = [
  "Employee Attendance Tracking",
  "Role-Based Dashboards",
  "Real-Time Analytics",
  "Smart Notifications",
];

const dashboardPanels = [
  {
    title: "Admin console",
    description: "Roster oversight, approvals, and activity timeline all in one card.",
  },
  {
    title: "Employee portal",
    description: "Check-in, history, and personalized alerts for every person on the team.",
  },
];

const testimonials = [
  {
    quote:
      "PulseDesk gave us a shared truth for attendance—admins trust the dashboards, and employees love the transparency.",
    person: "Dana Pierce, HR Director",
    role: "Healthcare",
  },
  {
    quote:
      "We launched within a week because the prototype already felt complete: analytics, notifications, and invites all worked.",
    person: "Rohit Nair, Operations Lead",
    role: "Logistics",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$0",
    description: "For small pilots and trials—includes 5 users, mock data, and the employee portal.",
  },
  {
    name: "Growth",
    price: "$49",
    description: "Full admin + employee experience with analytics, notifications, and reporting exports.",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Add real backends, SSO, and tailored onboarding once you lift off from the prototype.",
  },
];

export default function Home() {
  const handleDemoSignIn = (role: "admin" | "employee") => {
    const payload =
      role === "admin"
        ? { email: "sasha@pulsedesk.com", password: "admin123" }
        : { email: "rahul@pulsedesk.com", password: "employee123" };

    void signIn("credentials", {
      ...payload,
      callbackUrl: role === "admin" ? "/admin" : "/employee",
    });
  };
  return (
    <div className="bg-zinc-950 text-zinc-50">
      <header className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950">
        <div className="bg-amber-500/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-amber-200">
          ⚡ Demo Mode – Data resets periodically. Use the quick buttons below to sign in instantly.
        </div>
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-sm font-semibold">
          <span className="text-xl tracking-tight">PulseDesk</span>
          <div className="hidden items-center gap-5 md:flex">
            <a href="#problem" className="transition hover:text-white">
              Problem
            </a>
            <a href="#solution" className="transition hover:text-white">
              Solution
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#dashboard" className="transition hover:text-white">
              Dashboards
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
          </div>
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white transition hover:border-white"
          >
            Login
          </Link>
        </nav>
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-amber-300">Employee management, reimagined</p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Control check-ins, profiles, and alerts without leaving one modern dashboard.
            </h1>
            <p className="text-lg text-zinc-300">
              PulseDesk unifies the admin console and employee portal so attendance is always accurate, insights update
              in real-time, and notifications travel straight to the people who need them.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900">
                Launch demo
              </button>
              <button
                onClick={() => handleDemoSignIn("admin")}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
              >
                Login as Admin
              </button>
              <button
                onClick={() => handleDemoSignIn("employee")}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
              >
                Login as Employee
              </button>
              <Link
                href="/employee"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white"
              >
                Try employee view
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Live preview</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">PulseDesk HQ</h2>
            <div className="mt-5 space-y-3 text-sm text-zinc-300">
              <p>Admin: Attendance summary, notifications, activity logs.</p>
              <p>Employee: Check-in button, history, personalized reminders.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-16">
        <section id="problem" className="space-y-4 rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Problem</p>
          <h2 className="text-3xl font-semibold text-white">Attendance data is scattered and trust is low.</h2>
          <p className="text-sm text-zinc-400">
            Managers shuffle spreadsheets, employees chase emails, and no one has a shared source of truth for who arrived when.
            That means missed approvals, late payroll, and frustrated teams.
          </p>
        </section>

        <section id="solution" className="space-y-4 rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Solution</p>
          <h2 className="text-3xl font-semibold text-white">One web app gives every role the data they need.</h2>
          <p className="text-sm text-zinc-400">
            PulseDesk ties together NextAuth-powered sessions, tracker-backed attendance, dashboards, and alerts so admins
            can act, and employees can see their own history and reminders without calling support.
          </p>
        </section>

        <section id="features" className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Features</p>
            <h2 className="text-3xl font-semibold">Everything a modern HR/Operations team needs.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.8)]"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Feature</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{feature}</h3>
                <p className="mt-3 text-sm text-zinc-400">
                  PulseDesk delivers {feature.toLowerCase()} plus extra context so you can measure, notify, and
                  follow up in one flow.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="dashboard" className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Dashboard snapshots</p>
            <h2 className="text-3xl font-semibold">Screens that feel like a real product.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {dashboardPanels.map((panel) => (
              <div
                key={panel.title}
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 p-6"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">{panel.title}</p>
                <p className="mt-3 text-sm text-zinc-300">{panel.description}</p>
                <div className="mt-6 grid gap-3 rounded-2xl border border-white/5 bg-black/40 p-4 text-xs uppercase tracking-[0.4em] text-zinc-400">
                  <span>Analytics</span>
                  <span>Notifications</span>
                  <span>Activity</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Testimonials</p>
            <h2 className="text-3xl font-semibold">Teams love seeing it in one place.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.person}
                className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-[0_20px_30px_rgba(0,0,0,0.75)]"
              >
                <p className="text-sm text-zinc-300">“{testimonial.quote}”</p>
                <footer className="mt-4 text-xs uppercase tracking-[0.4em] text-amber-300">
                  {testimonial.person} • {testimonial.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="pricing" className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Pricing</p>
            <h2 className="text-3xl font-semibold">Choose the right prototype bundle.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-[0_20px_35px_rgba(0,0,0,0.7)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300">{plan.name}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{plan.price}</p>
                <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
