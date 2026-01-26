# Security Guide - Production Hardening

⚠️ **CRITICAL**: Your current CRM has **PUBLIC ACCESS** enabled. Anyone with the URL can view, create, modify, and delete ALL contacts.

This guide explains how to secure your application for production use.

---

## Current Security Status

### What's Implemented (MVP)
- ✅ Row Level Security (RLS) is **enabled**
- ❌ Policies allow **public access** (no authentication)
- ❌ Anyone can read/write/delete all data
- ❌ No user authentication
- ❌ No data ownership/isolation

### Current Policies (INSECURE)
```sql
-- These policies allow ANYONE to do ANYTHING
CREATE POLICY "Enable read access for all users" ON contacts
  FOR SELECT USING (true);  -- ⚠️ Anyone can read

CREATE POLICY "Enable insert access for all users" ON contacts
  FOR INSERT WITH CHECK (true);  -- ⚠️ Anyone can create

CREATE POLICY "Enable update access for all users" ON contacts
  FOR UPDATE USING (true);  -- ⚠️ Anyone can modify

CREATE POLICY "Enable delete access for all users" ON contacts
  FOR DELETE USING (true);  -- ⚠️ Anyone can delete
```

---

## 🔒 How to Secure for Production

### Option 1: Simple Authentication (Recommended First Step)

This adds basic user authentication where each user has their own contacts.

#### Step 1: Enable Supabase Authentication

1. **Go to Supabase Dashboard**
   - Authentication → Providers
   - Enable Email/Password authentication

2. **Update Database Schema**

Run this SQL in Supabase SQL Editor:

```sql
-- Add user_id column to contacts table
ALTER TABLE contacts ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update existing contacts to have a default user (optional, or delete them)
-- UPDATE contacts SET user_id = 'your-user-id-here';

-- Make user_id required for new contacts
ALTER TABLE contacts ALTER COLUMN user_id SET NOT NULL;

-- Add index for better query performance
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
```

3. **Replace RLS Policies**

Delete the old public policies and add secure ones:

```sql
-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON contacts;
DROP POLICY IF EXISTS "Enable insert access for all users" ON contacts;
DROP POLICY IF EXISTS "Enable update access for all users" ON contacts;
DROP POLICY IF EXISTS "Enable delete access for all users" ON contacts;

-- Create secure policies (users can only access their own data)
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  USING (auth.uid() = user_id);
```

#### Step 2: Update Frontend Code

**Install Supabase Auth UI (optional but easier)**:
```bash
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

**Create Authentication Pages**:

`src/pages/LoginPage.tsx`:
```typescript
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function LoginPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/')
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Simple CRM</h1>
          <p className="mt-2 text-gray-600">Sign in to manage your contacts</p>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  )
}
```

**Create Protected Route Component**:

`src/components/ProtectedRoute.tsx`:
```typescript
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
```

**Update App.tsx Routing**:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/query-client'
import { MainLayout } from '@/components/layout'
import { ContactsPage, ContactDetailPage, NotFoundPage } from '@/pages'
import LoginPage from '@/pages/LoginPage'
import ProtectedRoute from '@/components/ProtectedRoute'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ContactsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ContactDetailPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#2563eb',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  )
}

export default App
```

**Update Contact Service to Include user_id**:

`src/services/contact.service.ts` - Add to create function:
```typescript
async create(input: CreateContactInput): Promise<Contact> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const cleanedInput = {
    ...input,
    user_id: user.id, // Add user_id to new contacts
    phone: input.phone?.trim() || null,
    // ... rest of the cleaning code
  }

  // ... rest of create function
}
```

**Add Logout Button to Header**:

`src/components/layout/Header.tsx`:
```typescript
import { Link, useNavigate } from 'react-router-dom'
import { Users, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui'

export default function Header() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
            <Users className="h-8 w-8" />
            <span className="text-xl font-bold">Simple CRM</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
            >
              Contacts
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

---

### Option 2: Enterprise Security (Advanced)

For enterprise use, add these additional security measures:

#### 1. Rate Limiting

Add to your Supabase project or use Vercel's rate limiting:

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
})
```

#### 2. Email Verification

Require email verification before access:

```sql
-- In Supabase Dashboard → Authentication → Email Templates
-- Enable "Confirm signup" email template
```

#### 3. Role-Based Access Control (RBAC)

```sql
-- Create roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user', 'readonly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies based on roles
CREATE POLICY "Admins can view all contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
    OR auth.uid() = contacts.user_id
  );
```

#### 4. Audit Logging

Track who changed what:

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger function for auditing
CREATE OR REPLACE FUNCTION log_contact_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_log (user_id, table_name, record_id, action, old_data)
    VALUES (auth.uid(), 'contacts', OLD.id, 'DELETE', row_to_json(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_log (user_id, table_name, record_id, action, old_data, new_data)
    VALUES (auth.uid(), 'contacts', NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_log (user_id, table_name, record_id, action, new_data)
    VALUES (auth.uid(), 'contacts', NEW.id, 'INSERT', row_to_json(NEW));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER audit_contacts_changes
  AFTER INSERT OR UPDATE OR DELETE ON contacts
  FOR EACH ROW EXECUTE FUNCTION log_contact_changes();
```

#### 5. Data Encryption

Encrypt sensitive fields:

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt phone numbers in database
ALTER TABLE contacts
  ALTER COLUMN phone TYPE BYTEA
  USING pgp_sym_encrypt(phone, current_setting('app.encryption_key'));

-- Update application to decrypt when reading
-- In your service layer:
const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
```

---

## 📁 File Attachments with Supabase Storage

To add file upload functionality:

### 1. Enable Supabase Storage

In Supabase Dashboard:
1. Go to Storage
2. Create a new bucket called `contact-files`
3. Set policies for the bucket

### 2. Add Storage Policies

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'contact-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view their own files
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'contact-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'contact-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 3. Update Database Schema

```sql
-- Add attachments column to contacts
ALTER TABLE contacts ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;
```

### 4. Add Upload Component

```typescript
// src/components/contacts/FileUpload.tsx
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface FileUploadProps {
  contactId: string
  onUploadComplete: (fileUrl: string) => void
}

export default function FileUpload({ contactId, onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('User not authenticated')

      const fileName = `${user.id}/${contactId}/${Math.random()}.${fileExt}`

      const { error: uploadError, data } = await supabase.storage
        .from('contact-files')
        .upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('contact-files')
        .getPublicUrl(fileName)

      onUploadComplete(publicUrl)
      toast.success('File uploaded successfully')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button variant="secondary" disabled={uploading} asChild>
          <span>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload File'}
          </span>
        </Button>
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        disabled={uploading}
      />
    </div>
  )
}
```

---

## 🛡️ Additional Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env.local` to git
- ✅ Use different keys for dev/staging/production
- ✅ Rotate keys regularly

### 2. HTTPS Only
- ✅ Vercel provides HTTPS by default
- ✅ Never use HTTP in production

### 3. Input Validation
- ✅ Already using Zod for validation
- ✅ Always validate on both client and server

### 4. SQL Injection Protection
- ✅ Supabase JS client protects against SQL injection
- ✅ Never concatenate user input into raw SQL

### 5. XSS Protection
- ✅ React escapes values by default
- ❌ Be careful with `dangerouslySetInnerHTML`

### 6. CORS Configuration
Configure in Supabase if needed:
```javascript
// In Supabase Dashboard → Settings → API
// Add your domain to allowed origins
```

---

## 🎯 Immediate Action Items

### Priority 1 (Critical - Do This Now)
1. ⚠️ **Implement authentication** (Option 1 above)
2. ⚠️ **Update RLS policies** to check `auth.uid()`
3. ⚠️ **Add user_id column** to contacts table

### Priority 2 (Important - Do This Week)
4. 📧 Enable email verification
5. 🔒 Add logout functionality
6. 📊 Test with multiple user accounts

### Priority 3 (Nice to Have - Do This Month)
7. 📁 Add file attachments (if needed)
8. 📝 Implement audit logging
9. 🔐 Add 2FA (Two-Factor Authentication)

---

## Testing Your Security

After implementing authentication:

```bash
# Test 1: Try to access without login
# Should redirect to /login

# Test 2: Login as User A, create contacts
# User A should only see their own contacts

# Test 3: Login as User B
# User B should NOT see User A's contacts

# Test 4: Try to manipulate user_id in browser console
# Should be blocked by RLS policies
```

---

## Summary

**Current State**: ⚠️ **INSECURE** - Public access enabled
**Recommended**: ✅ Implement Option 1 (Simple Authentication)
**Timeline**: 2-4 hours of development work

Once authentication is added, your CRM will be production-ready and secure.
