# Simple CRM

A modern, full-stack Contact Relationship Management (CRM) application built with React, TypeScript, and Supabase. Built for the AIPB course.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://simple-crm-three.vercel.app)
[![Vercel](https://img.shields.io/badge/deployed%20on-vercel-black)](https://vercel.com)

**🌐 Live Application**: [https://simple-crm-three.vercel.app](https://simple-crm-three.vercel.app)

---

## Features

✨ **Full CRUD Operations**
- Create, read, update, and delete contacts
- Comprehensive contact information (name, email, phone, company, address, notes, tags)

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
- Supabase PostgreSQL database
- Row Level Security (RLS) policies
- Real-time updates with React Query
- Optimized database queries with indexes

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
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - REST API
  - Row Level Security (RLS)

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

   Open your Supabase project dashboard and run the SQL migrations:

   - Go to **SQL Editor** → **New Query**
   - Copy and run `supabase/migrations/001_create_contacts_table.sql`
   - Then run `supabase/seed.sql` to add sample contacts

   See `supabase/README.md` for detailed instructions.

5. **Start the development server**:
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
│   │   ├── contacts/      # Contact-specific components
│   │   ├── layout/        # Layout components (Header, MainLayout)
│   │   └── ui/            # Reusable UI components
│   ├── hooks/             # React Query hooks
│   ├── lib/               # Utilities and configurations
│   │   └── validations/   # Zod schemas
│   ├── pages/             # Route pages
│   ├── services/          # API service layer
│   ├── types/             # TypeScript interfaces
│   ├── App.tsx            # Main app component with routing
│   └── main.tsx           # Entry point
├── supabase/
│   ├── migrations/        # Database migrations
│   └── seed.sql           # Sample data
└── public/                # Static assets
```

---

## Database Schema

### `contacts` Table

| Column       | Type                     | Constraints           |
|--------------|--------------------------|-----------------------|
| id           | UUID                     | PRIMARY KEY           |
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
| created_at   | TIMESTAMP WITH TIMEZONE  | DEFAULT NOW()         |
| updated_at   | TIMESTAMP WITH TIMEZONE  | DEFAULT NOW()         |

**Indexes:**
- `idx_contacts_email` - Email lookups
- `idx_contacts_last_name` - Name sorting
- `idx_contacts_company` - Company filtering
- `idx_contacts_created_at` - Date sorting

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

## Security Notes

⚠️ **Current Configuration**: This MVP uses public access (no authentication) via Supabase RLS policies set to `true`. This is **intentional for development** but should not be used in production.

### For Production:
1. Enable Supabase Authentication
2. Update RLS policies to check `auth.uid()`
3. Add user ownership to contacts table
4. Implement proper access controls
5. Consider rate limiting

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
