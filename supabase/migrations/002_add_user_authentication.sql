-- Migration: Add user authentication and secure RLS policies
-- This migration adds user_id to contacts and replaces public access policies with user-specific ones

-- Step 1: Add user_id column to contacts table
ALTER TABLE contacts
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Create index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);

-- Step 3: Drop old insecure public access policies
DROP POLICY IF EXISTS "Enable read access for all users" ON contacts;
DROP POLICY IF EXISTS "Enable insert access for all users" ON contacts;
DROP POLICY IF EXISTS "Enable update access for all users" ON contacts;
DROP POLICY IF EXISTS "Enable delete access for all users" ON contacts;

-- Step 4: Create secure user-specific RLS policies
-- Users can only view their own contacts
CREATE POLICY "Users can view own contacts"
  ON contacts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert contacts with their own user_id
CREATE POLICY "Users can create own contacts"
  ON contacts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own contacts
CREATE POLICY "Users can update own contacts"
  ON contacts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own contacts
CREATE POLICY "Users can delete own contacts"
  ON contacts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Make user_id NOT NULL (after policies are in place)
-- Note: This will fail if there are existing contacts without user_id
-- In production, you'd migrate existing data first
-- For now, we'll keep it nullable to allow existing data
-- ALTER TABLE contacts ALTER COLUMN user_id SET NOT NULL;

-- Step 6: Create a function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_user_id_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create trigger to automatically set user_id
CREATE TRIGGER set_contacts_user_id
  BEFORE INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id_on_insert();
