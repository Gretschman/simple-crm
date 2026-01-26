-- Migration: Add file attachments support to contacts
-- This migration adds an attachments column to store file metadata

-- Step 1: Add attachments column to contacts table
-- Structure: array of objects with { name, url, size, type, uploaded_at }
ALTER TABLE contacts
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;

-- Step 2: Create index on attachments for querying
CREATE INDEX IF NOT EXISTS idx_contacts_attachments ON contacts USING GIN (attachments);

-- Note: Storage bucket and policies must be created via Supabase Dashboard or CLI
-- Follow these steps in Supabase Dashboard:
--
-- 1. Go to Storage → Create a new bucket
--    - Name: contact-files
--    - Public: No (private bucket)
--
-- 2. Set up storage policies for the bucket:
--
--    Policy: "Users can upload their own files"
--    - Operation: INSERT
--    - Policy definition:
--      (bucket_id = 'contact-files' AND auth.uid()::text = (storage.foldername(name))[1])
--
--    Policy: "Users can view their own files"
--    - Operation: SELECT
--    - Policy definition:
--      (bucket_id = 'contact-files' AND auth.uid()::text = (storage.foldername(name))[1])
--
--    Policy: "Users can delete their own files"
--    - Operation: DELETE
--    - Policy definition:
--      (bucket_id = 'contact-files' AND auth.uid()::text = (storage.foldername(name))[1])
--
-- 3. File path structure: {user_id}/{contact_id}/{filename}
--    This ensures users can only access their own files
