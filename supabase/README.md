# Supabase Database Setup

This directory contains the database migrations and seed data for the Simple CRM application.

## Prerequisites

- A Supabase project created at [supabase.com](https://supabase.com)
- Access to your Supabase Dashboard

## Running Migrations

### Option 1: Using the Supabase Dashboard (Recommended for MVP)

1. Open your Supabase project dashboard: https://supabase.com/dashboard/project/gkysjsylgqjrwglpvjzg

2. Navigate to the **SQL Editor** (left sidebar)

3. Click **"New Query"**

4. Copy the entire contents of `migrations/001_create_contacts_table.sql`

5. Paste into the SQL editor

6. Click **"Run"** or press `Cmd/Ctrl + Enter`

7. Verify success - you should see a message indicating the query executed successfully

### Option 2: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref gkysjsylgqjrwglpvjzg

# Run migrations
supabase db push
```

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
3. You should see 4 policies (SELECT, INSERT, UPDATE, DELETE) all allowing public access

## Database Schema

### contacts table

| Column      | Type                    | Constraints           | Description                      |
|-------------|-------------------------|-----------------------|----------------------------------|
| id          | UUID                    | PRIMARY KEY           | Auto-generated unique identifier |
| first_name  | VARCHAR(100)            | NOT NULL              | Contact's first name             |
| last_name   | VARCHAR(100)            | NOT NULL              | Contact's last name              |
| email       | VARCHAR(255)            | UNIQUE, NOT NULL      | Contact's email address          |
| phone       | VARCHAR(20)             |                       | Contact's phone number           |
| company     | VARCHAR(200)            |                       | Contact's company name           |
| job_title   | VARCHAR(100)            |                       | Contact's job title              |
| address     | TEXT                    |                       | Street address                   |
| city        | VARCHAR(100)            |                       | City                             |
| state       | VARCHAR(50)             |                       | State/Province                   |
| postal_code | VARCHAR(20)             |                       | Postal/ZIP code                  |
| country     | VARCHAR(100)            |                       | Country                          |
| notes       | TEXT                    |                       | Additional notes                 |
| tags        | TEXT[]                  |                       | Array of tags                    |
| created_at  | TIMESTAMP WITH TIMEZONE | DEFAULT NOW()         | Record creation timestamp        |
| updated_at  | TIMESTAMP WITH TIMEZONE | DEFAULT NOW()         | Record update timestamp          |

## Security Notes

**⚠️ IMPORTANT:** This MVP configuration allows public access to all contacts data (no authentication required). This is intentional for development but **should not be used in production**.

For production deployments:
1. Enable Supabase Authentication
2. Update RLS policies to check `auth.uid()`
3. Add user ownership to contacts
4. Implement proper access controls

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
