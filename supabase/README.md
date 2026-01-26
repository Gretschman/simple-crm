# Supabase Database Setup

This directory contains the database migrations and seed data for the Simple CRM application.

## Prerequisites

- A Supabase project created at [supabase.com](https://supabase.com)
- Access to your Supabase Dashboard

## Running Migrations

Run all migrations in order to set up the complete database schema with authentication and file storage support.

### Option 1: Using the Supabase Dashboard (Recommended)

#### Migration 001: Create contacts table

1. Open your Supabase project dashboard: https://supabase.com/dashboard/project/gkysjsylgqjrwglpvjzg

2. Navigate to the **SQL Editor** (left sidebar)

3. Click **"New Query"**

4. Copy the entire contents of `migrations/001_create_contacts_table.sql`

5. Paste into the SQL editor

6. Click **"Run"** or press `Cmd/Ctrl + Enter`

7. Verify success - you should see a message indicating the query executed successfully

#### Migration 002: Add user authentication (IMPORTANT)

1. In the **SQL Editor**, click **"New Query"**

2. Copy the entire contents of `migrations/002_add_user_authentication.sql`

3. Paste and click **"Run"**

4. This migration:
   - Adds `user_id` column to contacts table
   - Removes public access RLS policies
   - Creates secure user-specific RLS policies
   - Adds trigger to automatically set user_id on insert

**⚠️ NOTE:** If you have existing contacts from seed data, they will not have a user_id and will not be visible after this migration. You may want to clear existing data first with `DELETE FROM contacts;`

#### Migration 003: Add file attachments support

1. In the **SQL Editor**, click **"New Query"**

2. Copy the entire contents of `migrations/003_add_file_attachments.sql`

3. Paste and click **"Run"**

4. This adds an `attachments` JSONB column to store file metadata

### Option 2: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref gkysjsylgqjrwglpvjzg

# Run migrations
supabase db push
```

## Setting Up Storage Bucket

After running migrations, create a storage bucket for file attachments:

1. Navigate to **Storage** in your Supabase dashboard

2. Click **"Create a new bucket"**

3. Configure the bucket:
   - Name: `contact-files`
   - Public bucket: **No** (keep it private)
   - Click **"Create bucket"**

4. Set up storage policies:
   - Click on the `contact-files` bucket
   - Go to **Policies** tab
   - Click **"New policy"**

   **Policy 1: Users can upload their own files**
   - Template: Custom
   - Policy name: `Users can upload their own files`
   - Allowed operation: `INSERT`
   - Policy definition:
     ```sql
     (bucket_id = 'contact-files'::text AND (auth.uid())::text = (storage.foldername(name))[1])
     ```

   **Policy 2: Users can view their own files**
   - Policy name: `Users can view their own files`
   - Allowed operation: `SELECT`
   - Policy definition:
     ```sql
     (bucket_id = 'contact-files'::text AND (auth.uid())::text = (storage.foldername(name))[1])
     ```

   **Policy 3: Users can delete their own files**
   - Policy name: `Users can delete their own files`
   - Allowed operation: `DELETE`
   - Policy definition:
     ```sql
     (bucket_id = 'contact-files'::text AND (auth.uid())::text = (storage.foldername(name))[1])
     ```

5. File path structure will be: `{user_id}/{contact_id}/{filename}`
   - This ensures users can only access their own files

## Loading Seed Data

After running the migration, load sample contacts:

1. In the **SQL Editor**, click **"New Query"**

2. Copy the entire contents of `seed.sql`

3. Paste into the SQL editor

4. Click **"Run"**

5. Verify the data:
   - Navigate to **Table Editor** → **contacts**
   - You should see 5 contacts listed

## Verifying the Setup

### Check Tables
1. Go to **Table Editor** in your Supabase dashboard
2. You should see the `contacts` table
3. Click on it to view the 5 seed records

### Check Indexes
1. Go to **Database** → **Indexes**
2. Verify these indexes exist:
   - `idx_contacts_email`
   - `idx_contacts_last_name`
   - `idx_contacts_company`
   - `idx_contacts_created_at`

### Check RLS Policies
1. Go to **Authentication** → **Policies**
2. Select the `contacts` table
3. After migration 002, you should see 4 user-specific policies:
   - `Users can view own contacts` (SELECT)
   - `Users can create own contacts` (INSERT)
   - `Users can update own contacts` (UPDATE)
   - `Users can delete own contacts` (DELETE)

### Check Storage Bucket
1. Go to **Storage**
2. Verify `contact-files` bucket exists
3. Check that storage policies are configured

## Database Schema

### contacts table

| Column      | Type                    | Constraints              | Description                      |
|-------------|-------------------------|--------------------------|----------------------------------|
| id          | UUID                    | PRIMARY KEY              | Auto-generated unique identifier |
| user_id     | UUID                    | FK → auth.users          | Owner of the contact             |
| first_name  | VARCHAR(100)            | NOT NULL                 | Contact's first name             |
| last_name   | VARCHAR(100)            | NOT NULL                 | Contact's last name              |
| email       | VARCHAR(255)            | UNIQUE, NOT NULL         | Contact's email address          |
| phone       | VARCHAR(20)             |                          | Contact's phone number           |
| company     | VARCHAR(200)            |                          | Contact's company name           |
| job_title   | VARCHAR(100)            |                          | Contact's job title              |
| address     | TEXT                    |                          | Street address                   |
| city        | VARCHAR(100)            |                          | City                             |
| state       | VARCHAR(50)             |                          | State/Province                   |
| postal_code | VARCHAR(20)             |                          | Postal/ZIP code                  |
| country     | VARCHAR(100)            |                          | Country                          |
| notes       | TEXT                    |                          | Additional notes                 |
| tags        | TEXT[]                  |                          | Array of tags                    |
| attachments | JSONB                   | DEFAULT '[]'::jsonb      | File attachment metadata         |
| created_at  | TIMESTAMP WITH TIMEZONE | DEFAULT NOW()            | Record creation timestamp        |
| updated_at  | TIMESTAMP WITH TIMEZONE | DEFAULT NOW()            | Record update timestamp          |

## Security Notes

**✅ SECURE:** After running migration 002, the application requires authentication and implements proper Row Level Security:

- ✅ Supabase Authentication enabled (email/password)
- ✅ RLS policies enforce user isolation
- ✅ Users can only access their own contacts
- ✅ User_id automatically set on contact creation
- ✅ Storage policies restrict file access to owners

**⚠️ INITIAL STATE (Migration 001 only):** If you only run migration 001, the database allows public access. This is the initial MVP state but should be secured by running migration 002.

## Troubleshooting

### Migration fails with "relation already exists"
- The table was already created. You can either:
  - Drop the table: `DROP TABLE IF EXISTS contacts CASCADE;`
  - Or skip this migration if the schema matches

### Seed data fails with "duplicate key value"
- The email addresses already exist. Either:
  - Delete existing contacts first: `DELETE FROM contacts;`
  - Or modify the email addresses in seed.sql

### Can't see data in the application
- Verify RLS policies are created and enabled
- Check that policies allow public access (for MVP)
- Verify your `.env.local` file has correct Supabase credentials

## Next Steps

After completing the database setup:
1. Verify the 5 sample contacts appear in Table Editor
2. Return to the main application and test CRUD operations
3. The application should now be fully functional
