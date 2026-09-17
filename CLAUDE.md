# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vivah Vedam — a two-sided wedding planning marketplace. Combines venue booking (Amazon-style), service provider hiring (Upwork/Fiverr-style), guided wedding project management for couples, and an ops side for vendor onboarding/contracts/availability.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (pink/gold theme)
- **Database:** AWS RDS (PostgreSQL) — accessed through a small `pg`-based query builder in `src/lib/db/`, no ORM
- **Auth:** Our own JWT (via `jose`) + bcrypt sessions — `src/lib/auth/session.ts`, `src/lib/server/auth.ts`. Google OAuth is a manual authorization-code exchange, no third-party auth provider.
- **File storage:** AWS S3 (contract PDFs, vendor logo/cover uploads) — `src/lib/s3.ts`, using the EC2 instance's IAM role (no static AWS keys anywhere)
- **Payments:** Stripe Connect (escrow model)
- **Hosting:** Single AWS EC2 instance (nginx + PM2) — see `AWS_DEPLOYMENT.md`
- **Testing:** Vitest + React Testing Library
- **Fonts:** Fraunces (`--font-heading`), Outfit (`--font-body`), Cormorant Garamond (`--font-logo`, navbar wordmark only)

There is no Supabase, Vercel, or any other backend-as-a-service in this stack — everything above runs on infrastructure we provision directly on AWS.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run test` — Vitest watch mode
- `npm run test:run` — Vitest single run
- `npm run db:migrate` — Apply `rds/001_initial_schema.sql` + `rds/002_vendor_ops.sql` against `$DATABASE_URL`
- `npm run seed:demo` — Seed demo accounts + sample data (pg-based, see `scripts/seed-demo.mjs`)

## Architecture

Single monolithic Next.js app with role-based route groups:

- `(public)` — Landing, venue/service search, public profiles
- `(auth)` — Login, signup, onboarding
- `(couple)` — Couple dashboard under `/dashboard/*`
- `(vendor)` — Vendor dashboard under `/vendor/*` (listings, bookings, availability, business profile, contract, earnings)
- `(admin)` — Admin panel under `/admin/*` (users, vendors, listings, bookings, payments, reviews, audit log)

**Three user roles:** `couple`, `vendor`, `admin` — enforced per-page in server components (via `createDbSession()` + a `users.role` check), not database RLS. RLS depended on Supabase/PostgREST setting a per-request session variable; a plain `pg` connection from the Next.js server doesn't have that, so authorization lives in the application layer instead. `src/lib/server/route-guard.ts` has an equivalent check written as Next.js middleware, if you want to move enforcement there instead.

**Key directories:**
- `src/components/ui/` — shadcn/ui base components (auto-generated, themed)
- `src/components/layouts/` — Navbar, Footer, Sidebar, DashboardShell
- `src/components/forms/` — Form components
- `src/components/domain/` — Business-specific components
- `src/lib/db/` — `pool.ts` (pg Pool over RDS), `query-builder.ts` (chainable `.from().eq().select()` builder), `index.ts` (the `db()` / `rawQuery()` entry points)
- `src/lib/auth/session.ts` — JWT session tokens + bcrypt password hashing
- `src/lib/server/auth.ts` — `createDbSession()`, the per-request helper every server component/API route calls for `.auth.getUser()` + `.from()`
- `src/lib/s3.ts` — S3 upload / signed-URL helpers for contracts and vendor media
- `src/lib/stripe/` — Stripe payment utilities
- `src/types/` — Hand-maintained TypeScript types mirroring the RDS schema (`database.types.ts`)
- `rds/` — SQL migration files (`001_initial_schema.sql`, `002_vendor_ops.sql`)
- `infra/` — nginx config, PM2 ecosystem file, EC2 bootstrap/deploy scripts

## Design System

- **Primary:** Rose (pink) — HSL 347 77% 50%
- **Secondary/Accent:** Amber (gold) — HSL 43 96% 56%
- **Neutral:** Stone warm grays
- CSS variables defined in `src/app/globals.css`
- Headings use `font-heading` class (Fraunces)
- Body uses `font-body` class (Outfit)
- Navbar wordmark uses `font-logo` class (Cormorant Garamond, small-caps) to echo the flower logo's serif style

## Database

PostgreSQL on AWS RDS. Schema in `rds/001_initial_schema.sql` (core marketplace tables) + `rds/002_vendor_ops.sql` (vendor profiles, contracts, availability). No RLS — see Architecture above. Key tables: `users`, `weddings`, `venues`, `services`, `bookings`, `reviews`, `conversations`, `messages`, `journey_steps`, `categories`, `vendor_profiles`, `vendor_contracts`, `vendor_availability_weekly`, `vendor_availability_overrides`.

`users` is the sole identity table (no separate `auth.users`) — it carries `password_hash`, `oauth_provider`, and `oauth_id` directly. Signup/login/OAuth-callback routes (`src/app/api/auth/*`) write to it directly; there's no auth-provider trigger.

## Spec & Plans

- Design spec: `docs/superpowers/specs/2026-03-31-vivah-vedam-platform-design.md` (predates the AWS migration — architecture sections are superseded by `AWS_DEPLOYMENT.md` and this file)
- Implementation plans: `docs/superpowers/plans/`
- Design system: `design-system/vivah-vedam/MASTER.md`
