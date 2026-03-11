# PulseDesk Frontend

## Project Overview
PulseDesk is a prototype attendance and employee management experience built on Next.js App Router, tailored around role-aware consoles for admins and employees. This front-end simulates a full-stack workflow (auth, data, analytics, notifications) so stakeholders can explore workflows before wiring in a backend.

## Tech Stack
- **Next.js 16** (App Router, server/client components)
- **Tailwind CSS 4** + custom gradients
- **NextAuth** credentials provider for role-aware sessions
- **Framer Motion** micro-animations for cards, sidebar, and toast interactions
- **Sonner** toast library for success/error messaging
- **Recharts** for pie/line/bar analytics

## Architecture
1. **Providers**: `AuthProvider` (NextAuth) and `DataProvider` wrap the layout; the latter simulates API calls via `src/services/api.ts` while emitting Sonner toasts for error/success paths.
2. **API layer**: `src/services/api.ts` maintains in-memory stores of employees, attendance, and notifications, injecting delays and occasional failures so the UI behaves like it is calling real endpoints.
3. **Role routing**: `/admin/*` and `/employee/*` layouts plug into the shared `AppShell`, but middleware (`middleware.ts`) restricts access based on the JWT’s `role` claim.
4. **UI modules**: Landing page, login form, dashboards, notifications, and profile pages all live under `src/app` with client-side components leveraging the data context for fresher state.

## Role-Based Routing
| Route | Description | Accessible by |
| ----- | ----------- | ------------- |
| `/admin` | Admin shell (attendance, employees, reporting, notifications) | Admins only
| `/employee` | Employee portal (check-in, history, notifications, profile) | Employees only
| `/login` | Credentials sign-in that redirects based on role | Everyone
| `/` | Landing brochure + quick login/demo actions | Public

## Demo Credentials
| Role | Email | Password |
| ---- | ----- | -------- |
| Admin | `sasha@pulsedesk.com` | `admin123` |
| Employee | `rahul@pulsedesk.com` | `employee123` |

## Screenshots
*(Add your own screenshots under `public/screenshots/` and reference them below)*
- `public/screenshots/admin-overview.png` – Analytics + activity timeline
- `public/screenshots/employee-checkin.png` – Check-in widget with success toast
- `public/screenshots/landing.png` – Product story landing page

## Future Improvements
1. Swap the fake API layer for real endpoints (REST/GraphQL) so state persists between sessions and machines.
2. Expand admin tooling (approvals, exports, role management) plus employee self-service workflows.
3. Harden authentication (SSO, rotating secrets) and add middleware/guard coverage for every dynamic route.
