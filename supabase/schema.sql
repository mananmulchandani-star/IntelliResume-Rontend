-- ==============================================================================
-- IntelliResume Enterprise Database Schema
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create or Update Users Profile Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  phone TEXT,
  avatar_url TEXT,
  location TEXT,
  
  -- Student Specific Profile Fields
  college TEXT,
  degree TEXT,
  grad_year TEXT,
  cgpa TEXT,
  skills TEXT[],
  target_role TEXT,
  
  -- University & Recruiter Specific Organization Fields
  organization TEXT,
  department TEXT,
  company_website TEXT,
  tax_id TEXT,
  industry TEXT,
  company_size TEXT,
  accreditation_board TEXT,
  batch_capacity INTEGER,
  
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If the table already existed, ensure new columns are added safely
DO $$
BEGIN
  -- Contact & General
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
    ALTER TABLE public.users ADD COLUMN phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='location') THEN
    ALTER TABLE public.users ADD COLUMN location TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='target_role') THEN
    ALTER TABLE public.users ADD COLUMN target_role TEXT;
  END IF;

  -- Student fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='college') THEN
    ALTER TABLE public.users ADD COLUMN college TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='degree') THEN
    ALTER TABLE public.users ADD COLUMN degree TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='grad_year') THEN
    ALTER TABLE public.users ADD COLUMN grad_year TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='cgpa') THEN
    ALTER TABLE public.users ADD COLUMN cgpa TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='skills') THEN
    ALTER TABLE public.users ADD COLUMN skills TEXT[];
  END IF;

  -- Recruiter & University fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='company_website') THEN
    ALTER TABLE public.users ADD COLUMN company_website TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='tax_id') THEN
    ALTER TABLE public.users ADD COLUMN tax_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='industry') THEN
    ALTER TABLE public.users ADD COLUMN industry TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='company_size') THEN
    ALTER TABLE public.users ADD COLUMN company_size TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='accreditation_board') THEN
    ALTER TABLE public.users ADD COLUMN accreditation_board TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='batch_capacity') THEN
    ALTER TABLE public.users ADD COLUMN batch_capacity INTEGER;
  END IF;
END $$;

-- 2. Create Universities Table
CREATE TABLE IF NOT EXISTS public.universities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  type TEXT,
  location TEXT,
  accreditation_board TEXT,
  batch_capacity INTEGER DEFAULT 1000,
  dean_name TEXT,
  dean_email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- 3. Create Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  corporate_domains TEXT[],
  tax_id TEXT,
  industry TEXT,
  headquarters TEXT,
  recruiter_name TEXT,
  recruiter_title TEXT,
  recruiter_email TEXT,
  phone TEXT,
  hiring_volume TEXT,
  company_size TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 5. Create Permissive Policies for Web Application Operations
-- Users
DROP POLICY IF EXISTS "Allow public read users" ON public.users;
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert/update users" ON public.users;
CREATE POLICY "Allow authenticated insert/update users" ON public.users FOR ALL USING (true);

-- Universities
DROP POLICY IF EXISTS "Allow public read universities" ON public.universities;
CREATE POLICY "Allow public read universities" ON public.universities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert universities" ON public.universities;
CREATE POLICY "Allow public insert universities" ON public.universities FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update universities" ON public.universities;
CREATE POLICY "Allow update universities" ON public.universities FOR ALL USING (true);

-- Companies
DROP POLICY IF EXISTS "Allow public read companies" ON public.companies;
CREATE POLICY "Allow public read companies" ON public.companies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert companies" ON public.companies;
CREATE POLICY "Allow public insert companies" ON public.companies FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update companies" ON public.companies;
CREATE POLICY "Allow update companies" ON public.companies FOR ALL USING (true);

-- Indexes for lightning-fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_universities_status ON public.universities (status);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies (status);
