-- Vivah Vedam — AWS RDS PostgreSQL schema
-- Adapted from supabase/migrations/001_initial_schema.sql
--
-- Changes from the Supabase version:
--   1. public.users no longer references auth.users (Supabase-only schema) —
--      it is now the sole identity table, with its own password_hash / OAuth columns.
--   2. Row Level Security + all CREATE POLICY statements removed. RLS depended on
--      Supabase PostgREST setting auth.uid() per-request; a plain `pg` connection
--      from the Next.js server has no equivalent session variable. Authorization is
--      now enforced in the application layer (src/lib/db + the API routes), the same
--      way it already was for every server-rendered page in this codebase.
--   3. handle_new_user() / on_auth_user_created trigger removed (there is no
--      auth.users table to trigger from) — user rows are now inserted directly by
--      the app's signup route.
--
-- Run this once against a fresh RDS database:
--   psql "$DATABASE_URL" -f rds/schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types
CREATE TYPE user_role AS ENUM ('couple', 'vendor', 'admin');
CREATE TYPE wedding_status AS ENUM ('planning', 'confirmed', 'completed', 'cancelled');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE price_type AS ENUM ('fixed', 'hourly', 'custom');
CREATE TYPE journey_step_status AS ENUM ('upcoming', 'active', 'completed', 'skipped');

-- Users table — now the sole identity table (previously extended Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,                 -- NULL for OAuth-only accounts
  oauth_provider TEXT,                -- e.g. 'google'; NULL for password accounts
  oauth_id TEXT,                      -- provider's subject/user id
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role user_role NOT NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT users_auth_method CHECK (
    password_hash IS NOT NULL OR (oauth_provider IS NOT NULL AND oauth_id IS NOT NULL)
  )
);
CREATE UNIQUE INDEX idx_users_oauth ON public.users(oauth_provider, oauth_id) WHERE oauth_provider IS NOT NULL;

-- Weddings table
CREATE TABLE public.weddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  partner_1_name TEXT NOT NULL,
  partner_2_name TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  city TEXT NOT NULL,
  guest_count INTEGER NOT NULL,
  budget_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  budget_spent NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status wedding_status DEFAULT 'planning',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues table
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  capacity_min INTEGER NOT NULL,
  capacity_max INTEGER NOT NULL,
  price_per_day NUMERIC(12, 2) NOT NULL,
  amenities JSONB DEFAULT '[]'::JSONB,
  photos TEXT[] DEFAULT '{}',
  cover_image TEXT,
  rating_avg NUMERIC(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venue availability
CREATE TABLE public.venue_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  blocked_reason TEXT,
  UNIQUE(venue_id, date)
);

-- Categories (for open marketplace)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price_type price_type NOT NULL DEFAULT 'fixed',
  price_min NUMERIC(12, 2) NOT NULL,
  price_max NUMERIC(12, 2) NOT NULL,
  portfolio_images TEXT[] DEFAULT '{}',
  cover_image TEXT,
  city TEXT NOT NULL,
  service_radius_km INTEGER DEFAULT 50,
  rating_avg NUMERIC(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  vendor_id UUID NOT NULL REFERENCES public.users(id),
  couple_id UUID NOT NULL REFERENCES public.users(id),
  booking_date DATE NOT NULL,
  status booking_status DEFAULT 'pending',
  total_amount NUMERIC(12, 2) NOT NULL,
  platform_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  vendor_payout NUMERIC(12, 2) NOT NULL DEFAULT 0,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (venue_id IS NOT NULL OR service_id IS NOT NULL)
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.users(id),
  vendor_id UUID NOT NULL REFERENCES public.users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id)
);

-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID NOT NULL REFERENCES public.users(id),
  vendor_id UUID NOT NULL REFERENCES public.users(id),
  booking_id UUID REFERENCES public.bookings(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(couple_id, vendor_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journey steps table
CREATE TABLE public.journey_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  step_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status journey_step_status DEFAULT 'upcoming',
  order_index INTEGER NOT NULL,
  recommended_deadline DATE,
  completed_at TIMESTAMPTZ
);

-- Admin audit log
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.users(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  details JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_weddings_couple ON public.weddings(couple_id);
CREATE INDEX idx_venues_city ON public.venues(city);
CREATE INDEX idx_venues_vendor ON public.venues(vendor_id);
CREATE INDEX idx_venues_approved_active ON public.venues(is_approved, is_active);
CREATE INDEX idx_venue_availability_date ON public.venue_availability(venue_id, date);
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_services_city ON public.services(city);
CREATE INDEX idx_services_vendor ON public.services(vendor_id);
CREATE INDEX idx_services_approved_active ON public.services(is_approved, is_active);
CREATE INDEX idx_bookings_couple ON public.bookings(couple_id);
CREATE INDEX idx_bookings_vendor ON public.bookings(vendor_id);
CREATE INDEX idx_bookings_wedding ON public.bookings(wedding_id);
CREATE INDEX idx_reviews_vendor ON public.reviews(vendor_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);
CREATE INDEX idx_conversations_couple ON public.conversations(couple_id);
CREATE INDEX idx_conversations_vendor ON public.conversations(vendor_id);
CREATE INDEX idx_journey_steps_wedding ON public.journey_steps(wedding_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_conversations
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Update venue/service rating when review is added
CREATE OR REPLACE FUNCTION public.update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.bookings WHERE id = NEW.booking_id AND venue_id IS NOT NULL) THEN
    UPDATE public.venues
    SET
      rating_avg = (SELECT AVG(r.rating) FROM public.reviews r JOIN public.bookings b ON r.booking_id = b.id WHERE b.venue_id = venues.id),
      review_count = (SELECT COUNT(*) FROM public.reviews r JOIN public.bookings b ON r.booking_id = b.id WHERE b.venue_id = venues.id)
    WHERE id = (SELECT venue_id FROM public.bookings WHERE id = NEW.booking_id);
  END IF;

  IF EXISTS (SELECT 1 FROM public.bookings WHERE id = NEW.booking_id AND service_id IS NOT NULL) THEN
    UPDATE public.services
    SET
      rating_avg = (SELECT AVG(r.rating) FROM public.reviews r JOIN public.bookings b ON r.booking_id = b.id WHERE b.service_id = services.id),
      review_count = (SELECT COUNT(*) FROM public.reviews r JOIN public.bookings b ON r.booking_id = b.id WHERE b.service_id = services.id)
    WHERE id = (SELECT service_id FROM public.bookings WHERE id = NEW.booking_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_vendor_rating();

-- Auto-update budget_spent when booking is confirmed
CREATE OR REPLACE FUNCTION public.update_budget_spent()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE public.weddings
    SET budget_spent = (
      SELECT COALESCE(SUM(total_amount), 0)
      FROM public.bookings
      WHERE wedding_id = NEW.wedding_id AND status IN ('confirmed', 'in_progress', 'completed')
    )
    WHERE id = NEW.wedding_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_booking_status_change
  AFTER INSERT OR UPDATE OF status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_budget_spent();
