"use client";

const uspHighlights = [
  {
    title: "Real-time attendance",
    description:
      "Track check-in/out instantly so managers know exactly who is on-site without manual spreadsheets.",
  },
  {
    title: "Employee-centric insights",
    description:
      "Provide each team member with their own dashboard showing attendance history, streaks, and milestones.",
  },
  {
    title: "Secure admin controls",
    description:
      "Admins can create and manage employees, approve adjustments, and broadcast notifications from one console.",
  },
];

const serviceCards = [
  {
    title: "Employee Management",
    body: "Create, update, or deactivate staff profiles with departments, shifts, and roles plus quick search.",
  },
  {
    title: "Attendance Hub",
    body: "Mark or edit check-in/check-out times, review today’s attendance summaries, and flag late arrivals.",
  },
  {
    title: "Reporting & Analytics",
    body: "Export summaries, view present vs. absent trends, and monitor compliance with a glance.",
  },
  {
    title: "Notifications",
    body: "Send targeted announcements or reminders to admins, managers, or individuals via in-app alerts.",
  },
];

const testimonials = [
  {
    quote:
      "Switching to this front-end dashboard brought full clarity to our daily staffing and made reporting painless.",
    person: "Dana Pierce, HR Director",
    role: "Healthcare",
  },
  {
    quote:
      "Employees love having a personal view of their check-ins, and we finally trust attendance data without chasing emails.",
    person: "Rohit Nair, Operations Lead",
    role: "Logistics",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm font-semibold">
          <span className="text-xl tracking-tight">PulseDesk</span>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#usp" className="transition hover:text-white">
              Why PulseDesk?
            </a>
            <a href="#services" className="transition hover:text-white">
              What we provide
            </a>
            <a href="#testimonials" className="transition hover:text-white">
              Testimonials
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </div>
          <button className="rounded-full bg-amber-400 px-4 py-2 text-zinc-950 transition hover:bg-amber-300">
            Book a demo
          </button>
        </nav>
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Employee management</p>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Bring attendance, staff tools, and reporting together on one elegant front-end.
            </h1>
            <p className="text-lg text-zinc-300">
              Built for admins and employees, PulseDesk offers check-in/check-out automation, individual
              attendance history, and notifications so every stakeholder has context instantly.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-6 py-3 font-semibold text-zinc-900 transition hover:bg-zinc-100">
                Start with sample data
              </button>
              <button className="rounded-full border border-zinc-600 px-6 py-3 font-semibold text-zinc-200 transition hover:border-white">
                See admin console
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <p className="text-sm uppercase tracking-[0.4em] text-amber-300">Live view</p>
            <h2 className="mt-4 text-2xl font-semibold">Today’s attendance</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/50 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">present</p>
                  <p className="text-2xl font-semibold text-emerald-400">28</p>
                </div>
                <span className="text-xs text-zinc-400">updated 5m ago</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-zinc-900/50 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">absent</p>
                  <p className="text-2xl font-semibold text-rose-400">3</p>
                </div>
                <span className="text-xs text-zinc-400">needs review</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <section id="usp" className="space-y-8">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-300">Our USP</p>
          <div className="grid gap-6 md:grid-cols-3">
            {uspHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20"
              >
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="space-y-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">What we provide</p>
              <h2 className="text-3xl font-semibold">Everything required to run an attendance-first workplace.</h2>
            </div>
            <button className="rounded-full border border-zinc-600 px-4 py-2 text-sm uppercase tracking-[0.3em] text-zinc-400 transition hover:border-white">
              View documentation
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {serviceCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.8)]"
              >
                <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm text-zinc-300">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="space-y-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Testimonials</p>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <div
                key={item.person}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-200"
              >
                <p className="text-lg leading-relaxed text-white">“{item.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-amber-300">{item.person}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">{item.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="space-y-6 rounded-3xl border border-zinc-800 bg-gradient-to-b from-amber-500/20 to-white/10 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Contact us</p>
            <h2 className="text-3xl font-semibold text-white">Let’s align on your attendance goals.</h2>
            <p className="text-sm text-zinc-200">
              Share your challenges and we’ll tailor a lightweight rollout using our dummy data foundation so you can
              test before you automate.
            </p>
          </div>
          <form className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Full name"
              className="rounded-2xl border border-white/20 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-amber-300 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Work email"
              className="rounded-2xl border border-white/20 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-amber-300 focus:outline-none"
            />
            <textarea
              placeholder="Tell us what you need"
              rows={3}
              className="md:col-span-2 rounded-2xl border border-white/20 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-amber-300 focus:outline-none"
            />
            <button
              type="submit"
              className="md:col-span-2 rounded-2xl bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
            >
              Send message
            </button>
          </form>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-400">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} PulseDesk. Crafted for admins, loved by employees.</p>
            <div className="flex flex-wrap gap-4">
              <a className="transition hover:text-white" href="#">
                Privacy
              </a>
              <a className="transition hover:text-white" href="#">
                Terms
              </a>
              <a className="transition hover:text-white" href="#">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
