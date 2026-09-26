-- ==============================================================================
-- NAVIKX SUPABASE POSTGRESQL COMPLETE DATABASE SCHEMA & STORAGE SETUP
-- Run this SQL in your Supabase Project -> SQL Editor -> Click 'Run'
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 0. SCHEMA TYPE MISMATCH MIGRATION SAFEGUARD
-- Safely converts pre-existing UUID columns to TEXT to prevent:
-- "ERROR: operator does not exist: text = uuid"
-- ==============================================================================
DO $$
BEGIN
  -- Safe conversion for properties
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='id' AND data_type='uuid') THEN
    ALTER TABLE public.properties ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' AND column_name='owner_id' AND data_type='uuid') THEN
    ALTER TABLE public.properties ALTER COLUMN owner_id TYPE text USING owner_id::text;
  END IF;

  -- Safe conversion for saved_properties
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='saved_properties' AND column_name='id' AND data_type='uuid') THEN
    ALTER TABLE public.saved_properties ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='saved_properties' AND column_name='user_id' AND data_type='uuid') THEN
    ALTER TABLE public.saved_properties ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='saved_properties' AND column_name='property_id' AND data_type='uuid') THEN
    ALTER TABLE public.saved_properties ALTER COLUMN property_id TYPE text USING property_id::text;
  END IF;

  -- Safe conversion for activity_history
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='activity_history' AND column_name='id' AND data_type='uuid') THEN
    ALTER TABLE public.activity_history ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='activity_history' AND column_name='user_id' AND data_type='uuid') THEN
    ALTER TABLE public.activity_history ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='activity_history' AND column_name='property_id' AND data_type='uuid') THEN
    ALTER TABLE public.activity_history ALTER COLUMN property_id TYPE text USING property_id::text;
  END IF;

  -- Safe conversion for inquiries
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inquiries' AND column_name='id' AND data_type='uuid') THEN
    ALTER TABLE public.inquiries ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inquiries' AND column_name='property_id' AND data_type='uuid') THEN
    ALTER TABLE public.inquiries ALTER COLUMN property_id TYPE text USING property_id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inquiries' AND column_name='owner_id' AND data_type='uuid') THEN
    ALTER TABLE public.inquiries ALTER COLUMN owner_id TYPE text USING owner_id::text;
  END IF;

  -- Safe conversion for bookings
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bookings' AND column_name='id' AND data_type='uuid') THEN
    ALTER TABLE public.bookings ALTER COLUMN id TYPE text USING id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bookings' AND column_name='property_id' AND data_type='uuid') THEN
    ALTER TABLE public.bookings ALTER COLUMN property_id TYPE text USING property_id::text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bookings' AND column_name='user_id' AND data_type='uuid') THEN
    ALTER TABLE public.bookings ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;

  -- Safe conversion for valuations
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='valuations' AND column_name='id' AND data_type='uuid') THEN
    ALTER TABLE public.valuations ALTER COLUMN id TYPE text USING id::text;
  END IF;

  -- Safe conversion for profiles
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='id' AND data_type='uuid') THEN
    ALTER TABLE public.profiles ALTER COLUMN id TYPE text USING id::text;
  END IF;
END $$;

-- ==========================================
-- 1. PROPERTIES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    locality TEXT,
    city TEXT NOT NULL,
    price NUMERIC NOT NULL,
    price_display TEXT,
    category TEXT NOT NULL DEFAULT 'office', -- 'apartment', 'house', 'villa', 'office', 'commercial', 'factory', 'godown', 'plot', 'pg'
    listing_type TEXT NOT NULL DEFAULT 'rent', -- 'buy', 'rent', 'commercial', 'pg', 'sale'
    beds INTEGER DEFAULT 0,
    baths INTEGER DEFAULT 1,
    sqft NUMERIC NOT NULL DEFAULT 1000,
    carpet_area NUMERIC,
    furnishing TEXT DEFAULT 'Fully Furnished', -- 'Fully Furnished', 'Semi-Furnished', 'Unfurnished', 'Bare Shell'
    image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    description TEXT,
    featured BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT true,
    zero_brokerage BOOLEAN DEFAULT true,
    rera_approved BOOLEAN DEFAULT true,
    rera_id TEXT,
    possession_status TEXT DEFAULT 'Ready to Move',
    facing TEXT DEFAULT 'North-East',
    floor TEXT DEFAULT '5th of 14 Floors',
    parking TEXT DEFAULT '1 Covered Parking',
    age_of_property TEXT DEFAULT '0-2 Years',
    deposit NUMERIC,
    lease_duration TEXT DEFAULT '11 Months',
    pet_friendly BOOLEAN DEFAULT true,
    preferred_tenant TEXT DEFAULT 'Any',
    owner_id TEXT,
    owner_name TEXT,
    owner_phone TEXT,
    status TEXT DEFAULT 'active',
    amenities TEXT[] DEFAULT '{}',
    coordinates JSONB DEFAULT '{"lat": 19.076, "lng": 72.8777}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. SAVED PROPERTIES / USER WISHLIST TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.saved_properties (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    property_id TEXT NOT NULL,
    property_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_saved_properties_user ON public.saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_prop ON public.saved_properties(property_id);

-- ==========================================
-- 3. USER PROFILE & ACTIVITY AUDIT TRAIL
-- ==========================================
CREATE TABLE IF NOT EXISTS public.activity_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL, -- 'view_property', 'save_property', 'remove_saved', 'post_property', 'inquiry_sent', 'tour_scheduled', 'login', 'filter_search'
    title TEXT NOT NULL,
    details TEXT,
    property_id TEXT,
    property_title TEXT,
    property_image TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_history_user ON public.activity_history(user_id);

-- ==========================================
-- 4. PROPERTY INQUIRIES & LEAD MANAGEMENT
-- ==========================================
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    property_title TEXT,
    property_location TEXT,
    property_image TEXT,
    property_price NUMERIC,
    owner_id TEXT,
    owner_name TEXT,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT,
    message TEXT NOT NULL,
    inquiry_type TEXT DEFAULT 'General Query', -- 'Price Negotiation', 'Schedule Visit', 'Request Brochure', 'Loan Assistance', 'General Query'
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_prop ON public.inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_owner ON public.inquiries(owner_id);

-- ==========================================
-- 5. SITE VIEWING & TOUR BOOKINGS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    property_title TEXT NOT NULL,
    property_location TEXT NOT NULL,
    property_city TEXT,
    property_image TEXT,
    property_price NUMERIC,
    property_listing_type TEXT,
    user_id TEXT,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    tour_type TEXT NOT NULL DEFAULT 'In-Person Visit', -- 'In-Person Visit', 'Live Video Tour'
    notes TEXT,
    status TEXT DEFAULT 'confirmed', -- 'confirmed', 'pending', 'cancelled', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_prop ON public.bookings(property_id);

-- ==========================================
-- 6. PROPERTY VALUATION CALCULATOR REQUESTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.valuations (
    id TEXT PRIMARY KEY,
    property_type TEXT NOT NULL,
    city TEXT NOT NULL,
    locality TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    property_size TEXT,
    bhk TEXT,
    furnishing TEXT,
    estimated_price TEXT,
    estimated_rent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 7. USER PROFILES & EXTENDED METADATA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY, -- maps to auth.users.id or text ID
    name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user', -- 'user', 'seller', 'agent', 'admin'
    phone TEXT,
    avatar TEXT,
    city TEXT DEFAULT 'Mumbai',
    company_name TEXT,
    preferences JSONB DEFAULT '{"preferredCity": "Mumbai", "preferredCategory": "Office", "preferredFurnishing": "Fully Furnished"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 8. STORAGE BUCKET FOR CAMERA & PROPERTY PHOTOS
-- ==========================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-photos', 'property-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Policy for Property Photos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read on property-photos' AND tablename = 'objects') THEN
    CREATE POLICY "Public read on property-photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-photos');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert on property-photos' AND tablename = 'objects') THEN
    CREATE POLICY "Public insert on property-photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'property-photos');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public update on property-photos' AND tablename = 'objects') THEN
    CREATE POLICY "Public update on property-photos"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'property-photos');
  END IF;
END $$;

-- ==========================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow read & write access for seamless operations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on properties' AND tablename = 'properties') THEN
    CREATE POLICY "Allow public select on properties" ON public.properties FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on properties' AND tablename = 'properties') THEN
    CREATE POLICY "Allow all on properties" ON public.properties FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on saved_properties' AND tablename = 'saved_properties') THEN
    CREATE POLICY "Allow all on saved_properties" ON public.saved_properties FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on activity_history' AND tablename = 'activity_history') THEN
    CREATE POLICY "Allow all on activity_history" ON public.activity_history FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on inquiries' AND tablename = 'inquiries') THEN
    CREATE POLICY "Allow all on inquiries" ON public.inquiries FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on bookings' AND tablename = 'bookings') THEN
    CREATE POLICY "Allow all on bookings" ON public.bookings FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on valuations' AND tablename = 'valuations') THEN
    CREATE POLICY "Allow all on valuations" ON public.valuations FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on profiles' AND tablename = 'profiles') THEN
    CREATE POLICY "Allow all on profiles" ON public.profiles FOR ALL USING (true);
  END IF;
END $$;

-- ==========================================
-- 10. ENABLE REALTIME SYNC ON CRITICAL TABLES
-- ==========================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_properties;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_history;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;
