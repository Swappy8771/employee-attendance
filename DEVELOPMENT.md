# PulseDesk Frontend

## Overview
- Next.js 16 App Router + Tailwind 4 + TypeScript; ESLint/Biome and the standard `src/app`/`src/components` structure are already wired.
- Authentication relies on NextAuth’s credentials provider (`src/app/api/auth/[...nextauth]/route.ts`), issuing a JWT that the middleware honors to gate `/admin` vs `/employee` routes.
- All business logic lives in-memory via mock data in `src/data/mockEmployees.ts` (employees + user records) and `src/data/mockAttendance.ts` (attendance history), with `DataProvider` exposing mutate helpers.
- A fake API service (`src/services/api.ts`) now simulates network calls, delays, and occasional errors so the UI behaves like it is talking to a real backend.
- `mockEmployees` now ships 12 seeded people (1 admin + 11 employees) with departments, designations, join dates, statuses, phone numbers, and UI Avatars-based profile images so every profile and analytic element feels populated.
- `mockAttendance` builds 30 days of deterministic, pseudo-random entries per employee so the analytics charts and history pages always surface a populated timeline.
- Attendance status now derives automatically from the check-in time (`<= 09:15` = present, `> 09:15` = late, missing entry = absent) so the dashboard’s summary cards and charts feel intelligent without manual overrides.
- `DataProvider` now persists attendance, user profiles, and notifications in `localStorage` so each refresh keeps the last demo state, triggering `window.localStorage` reads/writes inside `src/context/data-context.tsx`.
- Landing, auth, and portal routes are split into brochure content (`/`), login (`/login`), admin console (`/admin/*`), employee portal (`/employee/*`), and the supporting API/middleware pieces.

## Key Components

### Layout & Shell
- `AppShell` (`src/components/app-shell.tsx`) is used by both admin and employee layouts; it renders a role-aware header/nav, optional sidebar links, and footer messaging while displaying context-provided children.
- `src/app/admin/layout.tsx` and `src/app/employee/layout.tsx` each declare the nav sidebar, header actions, and metadata for their respective portals so the shell can stay in sync with the active role.

### Authentication
- `LoginPage` (`src/app/login/page.tsx`) uses `signIn("credentials")` with the sample emails defined in `mockEmployees`; successful sessions are redirected based on role.
- `auth-context` (`src/context/auth-context.tsx`) wraps the NextAuth `SessionProvider` and exposes `useAuth` helpers plus a logout action; the auth context is mounted at the root layout.
- `middleware.ts` reads the JWT via `getToken` and redirects to `/login` any request under `/admin` or `/employee` that lacks the matching `role` claim.

-### Data & Mock Behavior
- `DataProvider` (`src/context/data-context.tsx`) now orchestrates API calls, persistence state, and Sonner toasts so every model, success, or failure surfaces as if you were hitting a real backend.
- Mutators such as `markCheckIn`, `markCheckOut`, `createEmployee`, `updateEmployee`, `toggleEmployeeStatus`, `markNotificationRead`, and `sendNotification` keep the fake backend interactive for demos.
- Attendance derives statuses (present/late/absent) automatically based on the mocked check-in time, and helper selectors like `todaysAttendance` + `getAttendanceForEmployee` feed the admin/employee screens.

### Landing Page
- `src/app/page.tsx` is the brochure view with hero, USP grid, service highlights, testimonials, contact form, and CTA buttons (including the requested login button); it tells a story that mirrors the admin/employee sections.

### Admin Experience
- `/admin/overview`, `/admin/attendance`, `/admin/employees`, `/admin/reporting`, and `/admin/notifications` are separate screens; every page reuses `useData` so the sidebar allows contextual nav without a monolith.
- `AdminAttendancePage` (`src/app/admin/attendance/page.tsx`) is now read-only, showing attendance stats and confirming attendance actions occur in the employee portal—no admin check-in/out buttons remain, so the admin role cannot mutate attendance anymore.
- `AdminOverviewPage` now layers Recharts-powered pie, line, and stacked bar visuals plus a Recent Activities timeline so admins can inspect today’s status, weekly trend, department breakdown, and a live activity feed at a glance.
- Reporting and notifications pages plug into the same mock data sources, giving the admin widgets for totals, flags, and broadcast messages.
- `AdminEmployeesPage` supports searching by name and filtering by department/status before presenting edit/deactivate controls so the roster stays manageable even as the mock dataset grows.
- `AdminNotificationsPage` lets admins craft announcements, alerts, or reminders (with role targeting) and shows unread badges/mark-read controls on the filtered list so sending feels intentional.
- `AdminAttendancePage` shows a loading skeleton, an empty state hint when no roster is active, and the new stats so the attendance board never looks sparse or abrupt.
- Framer Motion now powers micro animations (sidebar slide, hovering stats cards, animated notifications, and check-in success pulses) so the POC feels smoother without heavy framework work.
- The landing hero now surfaces a demo-alert banner plus quick “Login as Admin”/“Login as Employee” buttons so evaluators can sign in instantly with the seeded credentials instead of filling the form.

### Employee Experience
- `/employee/check-in`, `/employee/history`, `/employee/profile`, and `/employee/notifications` make up the employee portal.
- `EmployeeCheckInPage` keeps the actual check-in/out buttons, history filtering, and status indicators; all attendance mutations come from there so only employees can mark their own times.
- History, profile, and notifications pages pull from the context to surface personalized data, filters, and messages tied to the logged-in employee.
- `EmployeeProfilePage` now shows each user’s UI Avatars-based image, department, designation, phone, email, and join date while still letting them tweak department/shift settings, making the portal feel like a real human-friendly profile.
- `EmployeeCheckInPage` now briefly shows loading skeletons, success banners when actions happen, and an empty state hint if no records exist so the experience feels polished and communicative.

## Recent Changes
- Admin attendance is now purely observational—buttons were removed and a message clarifies that attendance actions belong to employees. Stats are derived from `todaysAttendance` for quick status checks.
- Seed data now includes 11 employees plus the admin with departments, designations, join dates, and randomized 30-day attendance so the dashboard feels populated.
- Recent activity logs appear on the overview so check-ins, check-outs, employee creation, and notifications all produce a readable timeline.
- Notifications now carry announcement/alert/reminder categories, unread badges, and a refreshed employee inbox featuring the new mock alerts (e.g., office closure or attendance reminders).

## Next Steps
1. Swap the localStorage persistence in `DataProvider` for a shared backend/API so attendance, employees, and notifications sync across devices and sessions instead of per-browser.
2. Expand admin tooling (searchable employee roster, exports, approvals) once back-end APIs exist so state can be saved beyond the current session.
3. Harden auth (e.g., real identity provider, rotating secrets) and optionally introduce middleware guards specific to check-in/out routes as the scope grows.
