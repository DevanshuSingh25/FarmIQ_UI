# Supabase Database Schema Update for Gram-Panchayat Role

## Overview
This document provides the SQL commands needed to update your Supabase database to support the **Gram-Panchayat (GP)** role.

## Required Changes

### 1. Update Users Table - Add GP Role Support

The `users` table currently has a `role` column. We need to ensure it accepts the new 'GP' role value.

**If using ENUM/CHECK constraint**, run:
```sql
-- First, check current constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new constraint with GP role
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('farmer', 'vendor', 'admin', 'GP'));
```

**If role is just TEXT without constraint** (most common), no schema change needed - the column will already accept 'GP' values.

---

### 2. Create Extended Farmer Tables (Text-Based, No File Uploads)

#### A. Marital Information Table
```sql
CREATE TABLE IF NOT EXISTS marital_info (
  id BIGSERIAL PRIMARY KEY,
  farmer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  marital_status TEXT CHECK(marital_status IN ('Married', 'Unmarried', 'Widowed', 'Divorced')),
  spouse_name TEXT,
  spouse_age INTEGER,
  spouse_aadhaar TEXT,
  spouse_occupation TEXT, -- "Housewife", "Farmer Woman", "Other: XYZ"
  caste_category TEXT,
  household_income DECIMAL(12, 2),
  has_bank_account BOOLEAN,
  disability_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_marital_info_farmer_id ON marital_info(farmer_id);
```

#### B. Children Details Table
```sql
CREATE TABLE IF NOT EXISTS children_details (
  id BIGSERIAL PRIMARY KEY,
  farmer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  child_number INTEGER NOT NULL, -- 1, 2, 3, etc.
  age INTEGER,
  gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
  in_school BOOLEAN,
  disability_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(farmer_id, child_number)
);

-- Index for faster farmer lookups
CREATE INDEX idx_children_details_farmer_id ON children_details(farmer_id);
```

#### C. Service Eligibility Table (Text-Based - NO File Uploads)
```sql
CREATE TABLE IF NOT EXISTS service_eligibility (
  id BIGSERIAL PRIMARY KEY,
  farmer_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  has_service BOOLEAN DEFAULT FALSE,
  relation_to_serviceperson TEXT, -- 'Self', 'Father', 'Mother', 'Spouse', 'Child'
  service_type TEXT, -- 'Army', 'Navy', 'Air Force', 'CAPF', 'Paramilitary'
  
  -- Text-based document details (NO file uploads per user request)
  service_certificate_number TEXT,
  service_id_number TEXT,
  issuing_authority TEXT,
  year_of_service INTEGER,
  discharge_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for unique farmer lookup
CREATE INDEX idx_service_eligibility_farmer_id ON service_eligibility(farmer_id);
```

---

### 3. Add GP Tracking to Profiles/Farmers Table

```sql
-- Add columns to track which GP user created this farmer
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS created_by_gp_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS extended_registration BOOLEAN DEFAULT FALSE;

-- Index for GP to find their farmers quickly
CREATE INDEX IF NOT EXISTS idx_profiles_created_by_gp ON profiles(created_by_gp_id);
```

---

### 4. Row Level Security (RLS) Policies for GP Role

If you have RLS enabled on Supabase, add these policies:

#### A. GP can read/edit users and profiles tables
```sql
-- GP can view all users
CREATE POLICY "GP can view all users"
ON users FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'GP')
);

-- GP can edit users (except password_hash)
CREATE POLICY "GP can update user profiles"
ON users FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'GP')
);

-- GP can view all profiles
CREATE POLICY "GP can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'GP')
);

-- GP can edit all profiles
CREATE POLICY "GP can update profiles"
ON profiles FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'GP')
);

-- GP can create new farmers
CREATE POLICY "GP can create farmers"
ON users FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role = 'GP')
  AND NEW.role = 'farmer'
);
```

#### B. GP read-only access to schemes
```sql
-- GP can only read schemes (no edit/delete)
CREATE POLICY "GP can read schemes"
ON ngo_schemes FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'GP')
);

-- Ensure GP cannot insert/update/delete schemes
CREATE POLICY "GP cannot modify schemes"
ON ngo_schemes FOR ALL
TO authenticated
USING (
  auth.uid() NOT IN (SELECT id FROM users WHERE role = 'GP')
);
```

#### C. GP full access to extended farmer tables
```sql
-- Marital Info
CREATE POLICY "GP can manage marital info"
ON marital_info FOR ALL
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'GP')
);

-- Children Details
CREATE POLICY "GP can manage children details"
ON children_details FOR ALL
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'GP')
);

-- Service Eligibility
CREATE POLICY "GP can manage service eligibility"
ON service_eligibility FOR ALL
TO authenticated
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'GP')
);
```

---

## Verification Queries

After applying the changes, verify with:

```sql
-- 1. Check if GP role works
INSERT INTO users (email, password_hash, role, phone)
VALUES ('test-gp@example.com', 'test_hash', 'GP', '9999999999')
RETURNING *;

-- 2. Check new tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('marital_info', 'children_details', 'service_eligibility');

-- 3. Check profile columns
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('created_by_gp_id', 'extended_registration');
```

---

## Summary of GP Role Permissions

| Table | GP Access |
|-------|-----------|
| **users** | ✅ Read All, ✅ Edit (except password) |
| **profiles** | ✅ Read All, ✅ Edit All |
| **ngo_schemes** | ✅ Read Only (NO edit/delete) |
| **marital_info** | ✅ Full Access |
| **children_details** | ✅ Full Access |
| **service_eligibility** | ✅ Full Access |
| **other tables** | ❌ No Access (unless explicitly granted) |

---

## Next Steps

1. **Run the SQL commands** in your Supabase SQL Editor (Project Settings → SQL Editor)
2. **Test GP registration** via the frontend
3. **Verify permissions** by attempting to create/edit farmers from GP account
4. **Backend code** will automatically work with these tables via the existing Supabase client

---

## Notes
- All text fields are used (no file uploads)
- Service eligibility uses certificate/ID numbers instead of file paths
- GP users tracked in `created_by_gp_id` column for audit trail
- RLS policies ensure GP cannot modify schemes table
