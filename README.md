# Simple CRM

A modern, full-stack Contact Relationship Management (CRM) application built with React, TypeScript, and Supabase. Built for the AIPB course.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://simple-crm-three.vercel.app)
[![Vercel](https://img.shields.io/badge/deployed%20on-vercel-black)](https://vercel.com)

**🌐 Live Application**: [https://simple-crm-three.vercel.app](https://simple-crm-three.vercel.app)

---

## Features

🔐 **Authentication & Security**
- Secure email/password authentication with Supabase Auth
- Protected routes and session management
- Row Level Security (RLS) for data isolation
- Users can only access their own contacts
- JWT-based authentication with automatic token refresh

✨ **Full CRUD Operations**
- Create, read, update, and delete contacts
- Comprehensive contact information (name, email, phone, company, address, notes, tags)
- User-specific data isolation

📎 **File Attachments**
- Upload files to contacts (documents, images, etc.)
- Secure file storage with Supabase Storage
- Max 5MB per file
- Download and delete attachments
- Files organized by user and contact

🔍 **Search & Filter**
- Real-time search across name, email, and company (300ms debounce)
- Sort by name, company, or date added
- Ascending/descending sort orders

📱 **Responsive Design**
- Mobile-first design
- Grid layout adapts: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Touch-friendly interface

🎨 **Modern UI/UX**
- Clean, professional interface with Tailwind CSS
- Loading states for all async operations
- Toast notifications for user feedback
- Empty states with helpful prompts
- Form validation with clear error messages
- Modal dialogs for actions

🔒 **Database & Backend**
- Supabase as complete Backend-as-a-Service
- PostgreSQL database with auto-generated REST API
- Row Level Security (RLS) policies
- Real-time updates with React Query
- Optimized database queries with indexes
- Secure file storage with bucket policies

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **TanStack Query** (React Query) - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Supabase** - Complete Backend as a Service (BaaS)
  - PostgreSQL database
  - Auto-generated REST API (PostgREST)
  - Supabase Auth (email/password authentication)
  - Supabase Storage (file attachments)
  - Row Level Security (RLS)
  - JWT token management

### Deployment
- **Vercel** - Frontend hosting and deployment
- **GitHub** - Version control

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Gretschman/simple-crm.git
   cd simple-crm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   Get these from: Supabase Dashboard → Settings → API

4. **Set up the database**:

   Open your Supabase project dashboard and run the SQL migrations in order:

   - Go to **SQL Editor** → **New Query**
   - Run `supabase/migrations/001_create_contacts_table.sql` (creates contacts table)
   - Run `supabase/migrations/002_add_user_authentication.sql` (adds auth and RLS)
   - Run `supabase/migrations/003_add_file_attachments.sql` (adds file support)

   See `supabase/README.md` for detailed instructions.

5. **Set up storage bucket**:

   - Go to **Storage** in Supabase Dashboard
   - Create a new bucket named `contact-files` (private)
   - Configure storage policies for user-specific file access

   See `supabase/README.md` for detailed policy configuration.

6. **Create a user account**:

   Once the app is running, click "Sign up" to create your account. You'll need to verify your email (check Supabase Auth settings if email confirmation is required).

7. **Start the development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

---

## Development

### Available Scripts

```bash
# Start dev server (localhost only)
npm run dev

# Start dev server with network access
npm run dev:network

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Project Structure

```
simple-crm/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components (ProtectedRoute)
│   │   ├── contacts/      # Contact-specific components + FileUpload
│   │   ├── layout/        # Layout components (Header, MainLayout)
│   │   └── ui/            # Reusable UI components
│   ├── hooks/             # React Query hooks + useAuth
│   ├── lib/               # Utilities and configurations
│   │   └── validations/   # Zod schemas
│   ├── pages/             # Route pages (Contacts, Login, Signup)
│   ├── services/          # API service layer
│   ├── types/             # TypeScript interfaces
│   ├── App.tsx            # Main app component with routing
│   └── main.tsx           # Entry point
├── supabase/
│   ├── migrations/        # Database migrations (3 files)
│   │   ├── 001_create_contacts_table.sql
│   │   ├── 002_add_user_authentication.sql
│   │   └── 003_add_file_attachments.sql
│   └── README.md          # Database setup guide
└── public/                # Static assets
```

---

## Database Schema

### `contacts` Table

| Column       | Type                     | Constraints           |
|--------------|--------------------------|-----------------------|
| id           | UUID                     | PRIMARY KEY           |
| user_id      | UUID                     | FK → auth.users       |
| first_name   | VARCHAR(100)             | NOT NULL              |
| last_name    | VARCHAR(100)             | NOT NULL              |
| email        | VARCHAR(255)             | UNIQUE, NOT NULL      |
| phone        | VARCHAR(20)              | -                     |
| company      | VARCHAR(200)             | -                     |
| job_title    | VARCHAR(100)             | -                     |
| address      | TEXT                     | -                     |
| city         | VARCHAR(100)             | -                     |
| state        | VARCHAR(50)              | -                     |
| postal_code  | VARCHAR(20)              | -                     |
| country      | VARCHAR(100)             | -                     |
| notes        | TEXT                     | -                     |
| tags         | TEXT[]                   | -                     |
| attachments  | JSONB                    | DEFAULT '[]'::jsonb   |
| created_at   | TIMESTAMP WITH TIMEZONE  | DEFAULT NOW()         |
| updated_at   | TIMESTAMP WITH TIMEZONE  | DEFAULT NOW()         |

**Indexes:**
- `idx_contacts_email` - Email lookups
- `idx_contacts_last_name` - Name sorting
- `idx_contacts_company` - Company filtering
- `idx_contacts_created_at` - Date sorting
- `idx_contacts_user_id` - User ownership filtering
- `idx_contacts_attachments` - GIN index for JSONB queries

---

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login and deploy**:
   ```bash
   vercel login
   vercel
   ```

3. **Add environment variables** in Vercel Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

See `DEPLOYMENT.md` for more deployment options (Netlify, GitHub Pages, etc.).

---

## Access from Mobile

For accessing the development server from your phone or other devices on your network:

```bash
npm run dev:network
```

Then access from your device using your PC's IP address.

For WSL2 users or remote access, see `ACCESS_FROM_MOBILE.md` for tunneling solutions.

---

## Security

✅ **Production-Ready Security**

This application implements comprehensive security measures:

### Authentication
- ✅ Supabase Authentication with email/password
- ✅ JWT token-based session management
- ✅ Protected routes requiring authentication
- ✅ Automatic token refresh
- ✅ Secure logout functionality

### Authorization
- ✅ Row Level Security (RLS) policies on all tables
- ✅ User-specific data isolation
- ✅ Users can only access their own contacts
- ✅ Storage policies restrict file access to owners
- ✅ Database-level authorization (cannot be bypassed)

### Data Protection
- ✅ HTTPS-only in production (Vercel)
- ✅ Environment variables for sensitive credentials
- ✅ Input validation with Zod schemas
- ✅ SQL injection protection (Supabase client)
- ✅ XSS protection (React auto-escaping)

### Future Enhancements
- [ ] Email verification required for signup
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting on API calls
- [ ] Audit logging for compliance
- [ ] Password reset functionality

---

## Known Limitations

1. **Tags Management**: Database supports tags (TEXT[]) but UI doesn't include tag editing. Tags from seed data display but can't be modified via forms.

2. **Authentication**: No user authentication in MVP. All contacts are publicly accessible.

3. **Optimistic Updates**: UI updates after server confirms changes (small delay but more reliable).

---

## Troubleshooting

### Can't connect to database
- Verify your Supabase credentials in `.env.local`
- Check that RLS policies are created and enabled
- Ensure tables were created successfully

### Build errors
- Delete `node_modules` and `package-lock.json`, then run `npm install`
- Clear build cache: `rm -rf dist .vite`
- Check Node.js version (requires 18+)

### Updates not working
- Check browser console for errors
- Verify form validation (all required fields filled)
- Check network tab for failed API requests

---

## Contributing

This is a course project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is for educational purposes as part of the AIPB course.

---

## Acknowledgments

- Built with guidance from Claude Code
- UI inspired by modern CRM interfaces
- Icons by [Lucide](https://lucide.dev/)

---

## Contact

**Project Link**: [https://github.com/Gretschman/simple-crm](https://github.com/Gretschman/simple-crm)

**Live Demo**: [https://simple-crm-three.vercel.app](https://simple-crm-three.vercel.app)

---

Made with ❤️ for the AIPB course
