> **Superseded:** this doc predates the move off Supabase/Vercel onto AWS (EC2 + RDS + S3) and the "Vivah Verse" → "Vivah Vedam" rename. For the current architecture, see `CLAUDE.md` and `AWS_DEPLOYMENT.md` at the repo root — this file is kept for historical product-spec context only (booking flow, roles, feature scope are still accurate).

# Vivah Vedam — Platform Design Spec

**Date:** 2026-03-31
**Status:** Approved
**Stack:** Next.js 15 (App Router) + Tailwind CSS v4 + shadcn/ui + Supabase + Stripe Connect + TypeScript

---

## 1. Overview

Vivah Vedam is a two-sided wedding marketplace that combines venue discovery/booking (Amazon-style), service provider hiring (Upwork/Fiverr-style), and end-to-end wedding project management through a guided journey.

**Business model:** Platform-managed payments with escrow. Couples pay through Vivah Vedam; platform holds payment, releases to vendor after service delivery, taking a configurable commission (default 10%, set via `PLATFORM_COMMISSION_RATE` env var).

**Target audience:** Global — not culture-specific.

**Three user roles:** Couple, Vendor, Admin.

---

## 2. Architecture

Single Next.js 15 monolithic app with App Router. Role-based route groups. Supabase handles auth, database, real-time, and file storage. Stripe Connect handles payments and vendor payouts.

### Project Structure

```
src/
├── app/
│   ├── (public)/          # Landing, search, venue/vendor pages
│   ├── (auth)/            # Login, signup, onboarding
│   ├── (couple)/          # Couple dashboard, guided journey
│   ├── (vendor)/          # Vendor dashboard, profile management
│   ├── (admin)/           # Admin panel
│   └── api/               # API routes (webhooks, etc.)
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── forms/             # Shared form components
│   ├── layouts/           # Shell layouts per role
│   └── domain/            # Business-specific components
├── lib/
│   ├── supabase/          # Client, server, middleware helpers
│   ├── stripe/            # Payment utilities
│   └── utils/             # General utilities
├── types/                 # TypeScript types & Supabase generated types
└── hooks/                 # Custom React hooks
```

---

## 3. Database Schema (Supabase/PostgreSQL)

### users
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | Supabase auth.users FK |
| email | text | unique |
| full_name | text | |
| avatar_url | text | |
| phone | text | |
| role | enum | 'couple', 'vendor', 'admin' |
| onboarding_completed | bool | default false |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### weddings
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| couple_id | uuid FK → users | |
| partner_1_name | text | |
| partner_2_name | text | |
| wedding_date | date | |
| city | text | |
| guest_count | int | |
| budget_total | numeric | |
| budget_spent | numeric | auto-calculated |
| status | enum | 'planning', 'confirmed', 'completed', 'cancelled' |
| created_at | timestamptz | |

### venues
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| vendor_id | uuid FK → users | |
| name | text | |
| description | text | |
| address | text | |
| city | text | |
| state | text | |
| country | text | |
| capacity_min | int | |
| capacity_max | int | |
| price_per_day | numeric | |
| amenities | jsonb | |
| photos | text[] | |
| cover_image | text | |
| rating_avg | numeric | |
| review_count | int | |
| is_approved | bool | admin approval |
| is_active | bool | vendor toggle |
| created_at | timestamptz | |

### venue_availability
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| venue_id | uuid FK → venues | |
| date | date | |
| is_available | bool | |
| blocked_reason | text | nullable |

### services
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| vendor_id | uuid FK → users | |
| title | text | |
| description | text | |
| category | text | vendor-defined |
| price_type | enum | 'fixed', 'hourly', 'custom' |
| price_min | numeric | |
| price_max | numeric | |
| portfolio_images | text[] | |
| cover_image | text | |
| city | text | |
| service_radius_km | int | |
| rating_avg | numeric | |
| review_count | int | |
| is_approved | bool | |
| is_active | bool | |
| created_at | timestamptz | |

### bookings
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| wedding_id | uuid FK → weddings | |
| venue_id | uuid FK → venues | nullable |
| service_id | uuid FK → services | nullable |
| vendor_id | uuid FK → users | |
| couple_id | uuid FK → users | |
| booking_date | date | |
| status | enum | 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed' |
| total_amount | numeric | |
| platform_fee | numeric | |
| vendor_payout | numeric | |
| stripe_payment_intent_id | text | |
| notes | text | |
| created_at | timestamptz | |

### reviews
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| booking_id | uuid FK → bookings | |
| reviewer_id | uuid FK → users | couple only |
| vendor_id | uuid FK → users | |
| rating | int | 1-5 |
| title | text | |
| body | text | |
| is_verified | bool | true when booking completed |
| created_at | timestamptz | |

### conversations
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| couple_id | uuid FK → users | |
| vendor_id | uuid FK → users | |
| booking_id | uuid FK → bookings | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### messages
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| conversation_id | uuid FK → conversations | |
| sender_id | uuid FK → users | |
| content | text | |
| read_at | timestamptz | nullable |
| created_at | timestamptz | |

### journey_steps
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| wedding_id | uuid FK → weddings | |
| step_type | text | 'venue', 'catering', etc. |
| title | text | |
| description | text | |
| status | enum | 'upcoming', 'active', 'completed', 'skipped' |
| order_index | int | |
| recommended_deadline | date | calculated from wedding_date |
| completed_at | timestamptz | |

### categories
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | |
| slug | text | unique |
| icon | text | |
| description | text | |
| is_system | bool | admin-created vs vendor-proposed |
| is_approved | bool | |
| created_at | timestamptz | |

### admin_audit_log
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| admin_id | uuid FK → users | |
| action | text | |
| target_type | text | |
| target_id | uuid | |
| details | jsonb | |
| created_at | timestamptz | |

---

## 4. Authentication & Authorization

**Provider:** Supabase Auth (email/password + Google OAuth)

**Signup flow:**
1. User signs up → picks role (couple or vendor)
2. Role stored in `users.role`
3. Onboarding: couples enter wedding details; vendors create profile + first listing

**Route protection:** Next.js middleware checks session + role. Route groups `(couple)`, `(vendor)`, `(admin)` are protected.

**RLS policies:**
- Couples: read public venues/services, CRUD own wedding/bookings/messages
- Vendors: CRUD own listings/bookings/messages, read own reviews
- Admins: full access, all actions logged to audit_log

---

## 5. Feature: Venue Discovery & Booking

**Flow:** Date-first discovery

1. **Hero search** — couple enters wedding date + city
2. **Results page** — grid of available venues, filters: capacity, budget, style (indoor/outdoor/garden), amenities
3. **Venue cards** — cover photo, name, price/day, rating, capacity badge
4. **Venue detail page** — photo gallery, description, amenities list, availability calendar, reviews, location (map embed), "Request to Book" CTA
5. **Booking request** — couple selects date, adds notes → request sent to vendor
6. **Vendor confirms/declines** from dashboard
7. **Payment** — on confirmation, couple pays deposit via Stripe → date locked in venue_availability

---

## 6. Feature: Service Provider Marketplace

**Open marketplace** — vendors define their own service categories. New categories require admin approval.

1. **Browse** (`/services`) — filter by category, city, price range, rating
2. **Service cards** — cover photo, title, vendor name, price range, rating
3. **Service detail page** — portfolio gallery, description, packages/pricing, reviews, vendor profile link
4. **Hire flow** — couple sends booking request with wedding date + requirements → vendor confirms → Stripe payment

**Vendor profile page** (`/vendors/[id]`) — bio, portfolio, all listed services, aggregated reviews, availability status

---

## 7. Feature: Guided Wedding Journey

Smart, progressive dashboard for couples — not a static checklist.

1. After venue booking, system generates personalized journey based on wedding date
2. Steps appear in recommended order with timing (e.g., "Book catering — recommended 6 months before")
3. Each step links to relevant marketplace results
4. Steps unlock progressively as bookings are confirmed
5. Budget tracker updates automatically with each booking
6. Timeline view shows all booked vendors and upcoming milestones

**Journey generation logic:** Based on wedding date, auto-create steps with recommended deadlines. Steps are soft suggestions — couples can skip or reorder.

---

## 8. Feature: Real-time Chat

**Powered by:** Supabase Realtime (PostgreSQL subscriptions on `messages` table)

- Conversations scoped to couple ↔ vendor pairs
- Optionally linked to a specific booking
- Unread message count indicators in both dashboards
- v1: text messages only (no file sharing)
- Message list with conversation sidebar layout

---

## 9. Feature: Vendor Dashboard

**Dashboard home:** Booking request count, upcoming events, earnings summary, unread messages

**Sections:**
- **Listings** — CRUD venues/services, manage photos, set pricing, manage availability calendar
- **Bookings** — incoming requests (accept/decline), confirmed bookings, history
- **Earnings** — payout history, pending payouts, platform fee breakdown
- **Reviews** — all reviews across all listings
- **Messages** — conversations with couples
- **Profile** — public profile management (bio, portfolio, contact info)

---

## 10. Feature: Admin Panel

**Dashboard:** Total users, active listings, bookings this month, revenue, pending approvals

**Sections:**
- **Users** — list/search all users, view details, suspend/unsuspend
- **Venues & Services** — approve/reject new listings, flag inappropriate content
- **Categories** — manage service categories, approve vendor-proposed categories
- **Bookings** — view all bookings, handle disputes (refund/release payment)
- **Payments** — payout overview, commission tracking, Stripe dashboard link
- **Reviews** — moderate flagged reviews, remove violations
- **Audit Log** — searchable log of all admin actions

---

## 11. Design System

### Color Palette (Pink/Gold)
- **Primary (Rose):** `rose-500` (#f43f5e) to `rose-700` (#be123c) — CTAs, active states, links
- **Accent (Gold):** `amber-400` (#fbbf24) to `amber-600` (#d97706) — highlights, badges, premium elements
- **Neutral:** `stone-50` to `stone-900` — backgrounds, text, borders
- **Success:** emerald-500 | **Error:** red-500 | **Warning:** amber-500

### Typography
- **Headings:** Playfair Display (serif) — elegant, wedding-appropriate
- **Body:** Inter (sans-serif) — clean, readable
- Loaded via `next/font/google`

### Components
- shadcn/ui as base, themed with pink/gold CSS variables in `globals.css`
- All shadcn components customized to match brand

### Responsive
- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## 12. Third-Party Integrations

| Service | Purpose |
|---------|---------|
| Supabase | Database, Auth, Realtime, Storage |
| Stripe Connect | Payments, escrow, vendor payouts |
| Google Maps / Mapbox | Venue location display |
| Vercel | Hosting & deployment |
| Google Fonts | Playfair Display + Inter |

---

## 13. Pages Summary

### Public
- `/` — Landing page with hero search
- `/venues` — Venue search results
- `/venues/[id]` — Venue detail
- `/services` — Service marketplace
- `/services/[id]` — Service detail
- `/vendors/[id]` — Vendor profile
- `/categories` — Browse all categories

### Auth
- `/login` — Email/password + Google OAuth
- `/signup` — Role selection + registration
- `/onboarding/couple` — Wedding details form
- `/onboarding/vendor` — Profile + first listing

### Couple Dashboard (`/dashboard`)
- `/dashboard` — Journey overview + progress
- `/dashboard/journey` — Full journey steps
- `/dashboard/bookings` — All bookings
- `/dashboard/budget` — Budget tracker
- `/dashboard/messages` — Chat
- `/dashboard/settings` — Account settings

### Vendor Dashboard (`/vendor`)
- `/vendor` — Dashboard home
- `/vendor/listings` — Manage venues/services
- `/vendor/listings/new` — Create listing
- `/vendor/bookings` — Manage bookings
- `/vendor/earnings` — Payout history
- `/vendor/reviews` — View reviews
- `/vendor/messages` — Chat
- `/vendor/profile` — Edit public profile
- `/vendor/settings` — Account settings

### Admin (`/admin`)
- `/admin` — Dashboard + stats
- `/admin/users` — User management
- `/admin/listings` — Venue/service approval
- `/admin/categories` — Category management
- `/admin/bookings` — Booking overview
- `/admin/payments` — Payment/payout tracking
- `/admin/reviews` — Review moderation
- `/admin/audit-log` — Admin action log
