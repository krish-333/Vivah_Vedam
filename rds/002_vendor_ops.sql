-- Vivah Vedam — migration 002: vendor ops (profile, contracts, availability)
-- Run after rds/001_initial_schema.sql (formerly schema.sql):
--   psql "$DATABASE_URL" -f rds/002_vendor_ops.sql

CREATE TYPE vendor_verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE contract_status AS ENUM ('draft', 'active', 'expired', 'terminated');

-- One row per vendor user — business details shown to couples + payout/tax info for ops.
CREATE TABLE public.vendor_profiles (
  vendor_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT,
  description TEXT,
  city TEXT,
  address TEXT,
  service_radius_km INTEGER DEFAULT 50,
  logo_url TEXT,
  cover_image_url TEXT,
  website_url TEXT,
  instagram_url TEXT,
  gstin TEXT,
  bank_account_name TEXT,
  bank_account_number_last4 TEXT,   -- only the last 4 digits are ever stored
  bank_ifsc TEXT,
  upi_id TEXT,
  verification_status vendor_verification_status NOT NULL DEFAULT 'pending',
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_vendor_profiles
  BEFORE UPDATE ON public.vendor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Admin-managed vendor contracts. Vendors can view; only admins write.
CREATE TABLE public.vendor_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status contract_status NOT NULL DEFAULT 'draft',
  commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00, -- percent, e.g. 10.00 = 10%
  payout_terms TEXT,
  start_date DATE,
  end_date DATE,
  notes TEXT,                 -- custom clauses / free-form terms
  pdf_url TEXT,                -- S3 object key, not a public URL — see src/lib/s3.ts
  pdf_uploaded_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_vendor_contracts_vendor ON public.vendor_contracts(vendor_id);

CREATE TRIGGER set_updated_at_vendor_contracts
  BEFORE UPDATE ON public.vendor_contracts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Recurring weekly default availability. One row per weekday per vendor;
-- absence of a row for a weekday is treated as "available" by the app.
CREATE TABLE public.vendor_availability_weekly (
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0 = Sunday
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (vendor_id, weekday)
);

-- Date-specific overrides on top of the weekly default (holidays, already-booked
-- dates blocked manually, one-off "available even though it's a Sunday", etc).
CREATE TABLE public.vendor_availability_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT FALSE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (vendor_id, date)
);
CREATE INDEX idx_vendor_availability_overrides_vendor_date
  ON public.vendor_availability_overrides(vendor_id, date);
