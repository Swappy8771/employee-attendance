# PulseDesk Frontend

## Overview
- Next.js 16 App Router with Tailwind 4, ESLint/Biome defaults, TypeScript, and App/Tailwind layout already wired in `src/app`.
- Authentication and attendance data live entirely in memory (mock data modules under `src/data/*`) with React contexts providing stateful helpers.
- Routes include `GET /` marketing landing, `/login`, `/admin`, and `/employee` plus the NextAuth credentials route; middleware now verifies the JWT issued by NextAuth instead of relying on a dedicated role cookie.

## Development Flow
1. **Landing + Branding**: `src/app/page.tsx` delivers the brochure hero + USP + contact CTA used while the product is still mock/data-driven.
2. **Auth & Data Providers**: `AuthProvider` (`src/context/auth-context.tsx`) now wraps NextAuth's `SessionProvider`, exposing `useAuth` for the session-aware user/logout pair, while `DataProvider` (`src/context/data-context.tsx`) stores mock employees, attendance, reporting metrics, and notifications with mutators.
3. **Routing & Layout**: `AppShell` (`src/components/app-shell.tsx`) renders role-aware navigation, while `root layout` wraps every page in the providers.
4. **Admin Experience**: `/admin` (`src/app/admin/page.tsx`) shows attendance numbers, attendance overrides, employee CRUD, reporting metrics, and notifications that call the shared context.
5. **Employee Experience**: `/employee` (`src/app/employee/page.tsx`) offers check-in/out controls, filtered history, profile settings, and personalized notifications fed by the same mock store.
6. **Protection**: Middleware (`middleware.ts`) now checks the JWT issued by NextAuth (`getToken`) before allowing `/admin` or `/employee` access, so only valid sessions can reach those routes.

## Next Steps
- Persist mock data (localStorage/IndexedDB) or replace the context providers with API calls.
- Add onboarding flows, exports, or more widgets as the first real user stories arrive.
- Replace the credentials provider with a real auth backend so middleware can verify signed NextAuth sessions.
