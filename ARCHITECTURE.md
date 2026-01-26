# System Architecture - Simple CRM

## Overview

Simple CRM is a full-stack web application built using modern web technologies with Supabase as the complete backend-as-a-service (BaaS) solution.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React 18 + TypeScript                    │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │   │
│  │  │   Pages    │  │ Components │  │   Hooks    │     │   │
│  │  └────────────┘  └────────────┘  └────────────┘     │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │      React Query (TanStack Query)              │ │   │
│  │  │      - Server state management                 │ │   │
│  │  │      - Caching & invalidation                  │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │      React Router v6                           │ │   │
│  │  │      - Client-side routing                     │ │   │
│  │  │      - Protected routes                        │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            │ HTTPS/REST                      │
│                            ▼                                 │
└─────────────────────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
┌───────────────────▼─────────────────▼───────────────────────┐
│                  Supabase Backend (BaaS)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase JavaScript Client              │   │
│  │  - Type-safe API calls                               │   │
│  │  - Real-time subscriptions (future)                  │   │
│  │  - Automatic retry & error handling                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│     ┌──────────────────────┼──────────────────────┐         │
│     │                      │                      │         │
│     ▼                      ▼                      ▼         │
│  ┌─────────┐          ┌─────────┐          ┌─────────┐     │
│  │  Auth   │          │Database │          │ Storage │     │
│  │         │          │         │          │         │     │
│  │ - Login │          │PostGreSQL│         │ Files & │     │
│  │ - Signup│◄────────►│  + RLS   │◄────────►│ Images │     │
│  │ - JWT   │          │         │          │         │     │
│  │ Tokens  │          │ Auto API │          │ Buckets │     │
│  └─────────┘          └─────────┘          └─────────┘     │
│                            │                      │         │
│                            │                      │         │
│                       ┌────┴──────┐          ┌────┴────┐    │
│                       │  Contacts │          │  Files  │    │
│                       │  Table    │          │  Bucket │    │
│                       │           │          │         │    │
│                       │ - RLS     │          │ - RLS   │    │
│                       │ - Triggers│          │ - Policies│  │
│                       │ - Indexes │          └─────────┘    │
│                       └───────────┘                         │
└─────────────────────────────────────────────────────────────┘
                             │
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Deployment Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Vercel                             │   │
│  │  - Static site hosting                                │   │
│  │  - Edge network CDN                                   │   │
│  │  - Automatic HTTPS                                    │   │
│  │  - Environment variables                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Frontend Layer

#### Technology Stack
- **React 18**: UI library with hooks and concurrent features
- **TypeScript**: Static typing for type safety
- **Vite**: Fast build tool and dev server with HMR
- **Tailwind CSS**: Utility-first CSS framework

#### State Management
- **TanStack Query (React Query)**: Server state management
  - Automatic caching with 5-minute stale time
  - Background refetching
  - Optimistic updates
  - Query invalidation on mutations

- **React Hook Form**: Form state management
  - Minimal re-renders
  - Built-in validation
  - Error handling

- **React Router**: Client-side routing
  - Protected routes with auth guards
  - Lazy loading (future optimization)

#### Key Libraries
- **Zod**: Runtime type validation for forms
- **Lucide React**: Icon library
- **React Hot Toast**: Toast notifications
- **@hookform/resolvers**: Form validation bridge

---

### 2. Backend Layer - Supabase (Complete BaaS)

Supabase provides a complete backend solution with:

#### 2.1 Auto-Generated REST API
- **PostgREST**: Automatically generates RESTful API from database schema
- **Type-safe**: Full TypeScript support via generated types
- **Real-time subscriptions**: WebSocket support for live updates (future feature)
- **Filtering**: Complex queries with URL parameters
- **Pagination**: Built-in pagination support

#### 2.2 Authentication (Supabase Auth)
- **Email/Password**: Primary authentication method
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Automatic token refresh
- **User Management**: Built-in user CRUD operations
- **Email Templates**: Customizable verification emails
- **Row Level Security**: Automatic user context in policies

**Authentication Flow:**
```
1. User submits credentials → Supabase Auth
2. Auth validates → generates JWT token
3. Token stored in localStorage/cookies
4. Token sent with every API request
5. RLS policies check auth.uid() automatically
```

#### 2.3 PostgreSQL Database
- **Fully managed**: Automatic backups and scaling
- **Row Level Security (RLS)**: Database-level authorization
- **Triggers**: Automatic updated_at timestamps
- **Indexes**: Optimized queries on email, name, company, dates
- **Full-text search**: Built-in search capabilities (future)
- **JSONB support**: Flexible data structures (tags)

**Schema Features:**
- UUID primary keys for security
- Automatic timestamps (created_at, updated_at)
- Foreign key relationships
- Check constraints for data integrity
- Composite indexes for complex queries

#### 2.4 Storage (Supabase Storage)
- **File buckets**: Organized file storage
- **RLS policies**: Secure file access control
- **Public/Private files**: Flexible access models
- **Image transformations**: Automatic resizing (future)
- **CDN**: Global file delivery
- **Max file size**: Configurable limits

**Storage Structure:**
```
contact-files/
├── {user_id}/
│   ├── {contact_id}/
│   │   ├── document.pdf
│   │   ├── photo.jpg
│   │   └── attachment.docx
```

---

### 3. Security Architecture

#### 3.1 Row Level Security (RLS)

**Principle**: Database enforces authorization at the row level

**Implementation:**
```sql
-- Users can only access their own contacts
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id);
```

**Benefits:**
- Cannot be bypassed by client code
- Works across all API methods
- Automatic user context
- No business logic in frontend

#### 3.2 Authentication Security

**Features:**
- JWT tokens with expiration
- Secure password hashing (bcrypt)
- HTTPS-only in production
- CORS configuration
- Rate limiting (future)

#### 3.3 Data Validation

**Multi-layer validation:**
1. **Client-side (Zod)**: Immediate user feedback
2. **Database constraints**: Final validation layer
3. **Type safety**: TypeScript compilation checks

---

### 4. Data Flow

#### Create Contact Flow
```
User fills form
    ↓
React Hook Form validates (Zod schema)
    ↓
Submit → useCreateContact hook
    ↓
Contact service (adds user_id)
    ↓
Supabase client → REST API
    ↓
RLS checks auth.uid() = user_id
    ↓
Insert into contacts table
    ↓
Response → React Query cache updated
    ↓
UI updates + success toast
```

#### Read Contacts Flow
```
Page load → useContacts hook
    ↓
Check React Query cache
    ↓ (if stale or empty)
Fetch from Supabase
    ↓
RLS filters rows (user_id = auth.uid())
    ↓
Return only user's contacts
    ↓
Cache result (5 min stale time)
    ↓
Render UI
```

#### File Upload Flow
```
User selects file
    ↓
FileUpload component
    ↓
Supabase Storage API
    ↓
Upload to {user_id}/{contact_id}/filename
    ↓
RLS checks upload policy
    ↓
File stored → public URL returned
    ↓
URL saved to contact.attachments
    ↓
Update contact → invalidate cache
```

---

## Key Design Decisions

### 1. Why Supabase?
- **Complete backend solution**: Auth, Database, Storage, APIs
- **PostgreSQL**: Robust, scalable, feature-rich
- **Type-safe**: Generated TypeScript types
- **Real-time capabilities**: Future WebSocket support
- **Open source**: Not vendor lock-in
- **Free tier**: Generous for MVP/small apps

### 2. Why React Query?
- **Server state management**: Separates server/client state
- **Automatic caching**: Reduces API calls
- **Optimistic updates**: Better UX
- **Devtools**: Excellent debugging
- **Industry standard**: Well-documented

### 3. Why TypeScript?
- **Type safety**: Catch errors at compile time
- **Better IDE support**: Autocomplete, refactoring
- **Self-documenting**: Types serve as documentation
- **Easier refactoring**: Confident code changes

### 4. Why Row Level Security?
- **Security by default**: Can't forget authorization
- **Simplified frontend**: No complex permission logic
- **Multi-tenant ready**: Easy to add organizations
- **Audit-friendly**: Clear security model

---

## Scalability Considerations

### Current Architecture (MVP)
- **Users**: 1-1000 users
- **Contacts**: Unlimited per user
- **Files**: 1GB free tier storage
- **API calls**: 500k/month free tier

### Scaling Options

#### Horizontal Scaling (Add more users)
- Supabase handles automatically
- RLS ensures data isolation
- No code changes needed

#### Vertical Scaling (More features)
- Add tables (companies, deals, tasks)
- Add relationships (foreign keys)
- Enable real-time subscriptions
- Add full-text search

#### Performance Optimization
- **Database indexes**: Already implemented
- **Query optimization**: Use select() to limit fields
- **Image optimization**: Supabase image transformations
- **CDN**: Vercel + Supabase CDN
- **Caching**: React Query + HTTP caching headers

---

## Monitoring & Observability

### Current Setup
- **Supabase Dashboard**: Query logs, API usage
- **Vercel Analytics**: Performance metrics
- **Browser DevTools**: React Query DevTools

### Future Enhancements
- **Sentry**: Error tracking
- **Posthog**: User analytics
- **Supabase Logs**: Audit trail
- **Custom metrics**: Business KPIs

---

## Development Workflow

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Add Supabase credentials

# 3. Run dev server
npm run dev
```

### Database Changes
```bash
# 1. Write migration SQL
supabase/migrations/XXX_description.sql

# 2. Run in Supabase Dashboard SQL Editor
# or use Supabase CLI:
supabase db push

# 3. Update TypeScript types (manual or codegen)
```

### Deployment Pipeline
```bash
# 1. Commit code
git add .
git commit -m "Description"

# 2. Push to GitHub
git push origin main

# 3. Vercel auto-deploys
# Vercel detects push → builds → deploys

# 4. Verify environment variables in Vercel Dashboard
```

---

## Testing Strategy

### Current (Manual Testing)
- Browser testing in dev environment
- Supabase Dashboard for database verification
- Network tab for API inspection

### Future (Automated Testing)
```
Unit Tests
├── Components (React Testing Library)
├── Hooks (React Hooks Testing Library)
├── Utils (Jest)
└── Validation (Zod schemas)

Integration Tests
├── API calls (MSW - Mock Service Worker)
├── Form submissions
└── Authentication flows

E2E Tests
├── User journeys (Playwright/Cypress)
├── Critical paths (login → create → edit → delete)
└── Cross-browser testing
```

---

## Security Checklist

### Implemented ✅
- [x] HTTPS enforced (Vercel)
- [x] Environment variables for secrets
- [x] Input validation (Zod)
- [x] SQL injection protection (Supabase client)
- [x] XSS protection (React escaping)

### In Progress 🔄
- [x] User authentication (implementing now)
- [x] Row Level Security (securing now)
- [x] User data isolation (adding user_id)
- [x] File upload security (implementing now)

### Future 📋
- [ ] Rate limiting
- [ ] Email verification required
- [ ] Two-factor authentication (2FA)
- [ ] Audit logging
- [ ] Data encryption at rest
- [ ] Regular security audits

---

## Future Enhancements

### Phase 2 - Organization Features
- Multiple users per organization
- Shared contacts
- Role-based permissions (admin, member, viewer)
- Team collaboration

### Phase 3 - Advanced Features
- Email integration (send emails from CRM)
- Calendar integration
- Task/reminder system
- Contact import/export (CSV)
- Advanced search (full-text search)
- Custom fields
- Tags management UI
- Contact deduplication

### Phase 4 - Enterprise Features
- SSO (Single Sign-On)
- SAML authentication
- Custom domains
- White-labeling
- Advanced analytics
- API for integrations
- Webhooks

---

## Technology Choices Comparison

### Why Supabase over Firebase?
| Feature | Supabase | Firebase |
|---------|----------|----------|
| Database | PostgreSQL (SQL) | Firestore (NoSQL) |
| Type System | Native SQL types | Limited |
| Complex Queries | Full SQL support | Limited |
| Open Source | Yes | No |
| Self-hostable | Yes | No |
| Pricing | More generous | Can be expensive |

### Why Vercel over Netlify?
| Feature | Vercel | Netlify |
|---------|--------|---------|
| React Focus | Excellent | Good |
| Edge Network | Global | Global |
| Analytics | Built-in | Add-on |
| Team | React creators | Independent |
| Integration | Seamless | Good |

---

## Conclusion

This architecture provides:
- ✅ **Scalability**: Handles growth from 1 to 10,000+ users
- ✅ **Security**: Multi-layer security with RLS
- ✅ **Developer Experience**: Type-safe, fast development
- ✅ **Performance**: Optimized caching and queries
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Cost-effective**: Free tiers for MVP, scales with usage

The use of Supabase as a complete backend solution eliminates the need for custom API development while providing enterprise-grade features out of the box.
