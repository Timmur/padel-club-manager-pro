# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Fecha**: 18 de Julio, 2025  
**Versión**: 2.1 (Proyecto Arrancado)  
**Tipo**: SaaS B2B para Administradores de Clubes de Pádel  
**Estado**: ✅ **PROYECTO FUNCIONANDO** - http://localhost:3000

---

## 🚀 Current Project Status

### ✅ **PROJECT SUCCESSFULLY LAUNCHED** - [2025-07-18]

**Application running at**: `http://localhost:3000`

**Tech Stack Implemented**:
- ✅ **Wasp 0.17.0** - Fullstack framework
- ✅ **Open SaaS Template** - Complete template
- ✅ **PostgreSQL** - Database in Docker
- ✅ **React + Vite** - Modern frontend
- ✅ **Node.js + Express** - Robust backend
- ✅ **Prisma ORM** - Database management
- ✅ **Complete Authentication** - Email, Google, GitHub, Discord
- ✅ **Payment Systems** - Stripe and LemonSqueezy
- ✅ **Deployment ready** - Fly.io integrated

## Development Commands

### Core Commands (WSL Environment Required)

```bash
# Start database (keep running)
wsl bash -c '/home/timur/.local/bin/wasp db start'

# Start application
wsl bash -c '/home/timur/.local/bin/wasp start'

# Apply migrations
wsl bash -c '/home/timur/.local/bin/wasp db migrate-dev'

# Open Prisma Studio
wsl bash -c '/home/timur/.local/bin/wasp db studio'

# Reset database (when needed)
wsl bash -c '/home/timur/.local/bin/wasp db reset'

# Generate Prisma client
wsl bash -c '/home/timur/.local/bin/wasp db generate'
```

### E2E Testing Commands

```bash
# Navigate to e2e-tests directory first
cd padel-club-manager-pro/e2e-tests

# Install dependencies
npm install

# Run all tests
npm test

# Run tests in headed mode (with browser UI)
npm run test:headed

# Run specific test file
npx playwright test landingPageTests.spec.ts
```

### Blog Development Commands

```bash
# Navigate to blog directory first
cd padel-club-manager-pro/blog

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Architecture

### Directory Structure

```
padel-club-manager-pro/
├── app/                              # Main Wasp application
│   ├── main.wasp                     # Wasp configuration file
│   ├── schema.prisma                 # Database schema
│   ├── src/
│   │   ├── client/                   # React frontend code
│   │   │   ├── App.tsx              # Main app component
│   │   │   ├── components/          # Reusable components
│   │   │   └── hooks/               # Custom React hooks
│   │   ├── server/                   # Node.js backend code
│   │   ├── shared/                   # Code shared between client/server
│   │   ├── dashboard/                # Dashboard-specific components
│   │   ├── auth/                     # Authentication components
│   │   ├── payment/                  # Payment integration
│   │   ├── admin/                    # Admin dashboard
│   │   └── landing-page/             # Landing page components
│   ├── public/                       # Static assets
│   └── migrations/                   # Database migrations
├── blog/                             # Astro-based blog
├── e2e-tests/                        # Playwright E2E tests
└── docs/                             # Project documentation
```

### Key Application Files

- **`main.wasp`**: Central configuration file defining routes, pages, queries, actions, and auth
- **`schema.prisma`**: Database schema with entities like User, Task, GptResponse, etc.
- **`src/dashboard/DashboardPage.tsx`**: Main dashboard component implemented
- **`src/client/components/layout/DashboardLayout.tsx`**: Layout wrapper for dashboard pages

### Current Implementation Status

#### ✅ Implemented Features
- User authentication (email-based)
- Basic dashboard structure with layout
- Dashboard stats, quick actions, and recent activity components
- Admin dashboard with analytics, user management, charts
- Payment integration (Stripe & LemonSqueezy)
- File upload functionality
- Contact form messaging

#### 🚧 In Development
- Padel-specific features (courts, bookings, matches)
- Multi-tenant club management
- Public booking interface

## Validation Commands

Since this is a Wasp project, validation is handled differently:

```bash
# Type checking and building (validates TypeScript)
wsl bash -c '/home/timur/.local/bin/wasp build'

# Database validation
wsl bash -c '/home/timur/.local/bin/wasp db migrate-dev'

# Run E2E tests for validation
cd padel-club-manager-pro/e2e-tests && npm test
```

## Auto-Checkpoint Configuration

### ✅ Configured Auto-Commit System

**Status**: Auto-checkpoint is configured and running automatically every 30 minutes.

#### Configuration Details:
- **Cron job**: `*/30 * * * * /home/timur/auto-checkpoint.sh >> /tmp/auto-checkpoint.log 2>&1`
- **Script location**: `/home/timur/auto-checkpoint.sh`
- **Git config**: 
  - Email: `timur.shar@gmail.com`
  - Name: `Timur`
- **Log file**: `/tmp/auto-checkpoint.log`

#### Commands for Management:
```bash
# Check if auto-checkpoint is running
crontab -l

# View auto-checkpoint logs
cat /tmp/auto-checkpoint.log

# Test script manually
~/auto-checkpoint.sh

# Quick project startup (already configured)
padel-start
```

#### Auto-Checkpoint Script Content:
The script automatically commits changes every 30 minutes with the message format:
`Auto-checkpoint: YYYY-MM-DD HH:MM:SS` plus Claude Code signature.

**⚠️ IMPORTANT**: This auto-checkpoint system is already configured and running. Do NOT reconfigure unless specifically requested by the user.

## Core Business Concept

### ⚠️ CRITICAL CONCEPT CORRECTION

**PadelClub Manager is NOT a player app**. It is a **B2B management tool for clubs**.

**Correct analogy**: We are like "Playtomic Manager" or "Shopify for padel clubs"

**Primary Users**:
- ✅ **Club administrators** (complete dashboard)
- ✅ **Club staff** (receptionists, managers)
- ✅ **Club owners** (analytics and reports)

**Secondary Users**:
- ✅ **Players** (simple public page for bookings only)

### Usage Flow

1. **Club subscribes** to PadelClub Manager (€49-199/month)
2. **Administrator configures** courts, schedules, prices
3. **Club staff uses dashboard** to manage daily bookings
4. **Players see public page** to join matches
5. **Club analyzes data** to optimize business

## Application Architecture

### Two Main Interfaces

#### 1. Administrative Dashboard (Primary Interface)
**URL**: `app.padelclub.com/dashboard`
**Users**: Administrators and club staff
**Features**:
- Complete booking management
- Court and pricing configuration
- Club member management
- Analytics and reports
- Club settings

#### 2. Public Club Page (Secondary Interface)
**URL**: `{club-slug}.padelclub.com` or `padelclub.com/club/{slug}`
**Users**: General public players
**Features**:
- View court availability
- Join open matches
- View club information
- Contact club

## Development Workflow

### MANDATORY RULE: TODO.md Management

**BEFORE STARTING ANY TASK**:
```markdown
ALWAYS save task in TODO.md before starting:

### Mandatory format:
- [ ] **[DATE]** Task name - **Difficulty: [EASY/MEDIUM/HARD/EXPERT]**
  - Detailed task description
  - Files to modify/create
  - Estimated time
  - Dependencies if any
```

**WHEN FINISHING TASK**:
```markdown
MANDATORY mark as completed:
- [x] **[2025-07-17]** Task name - **Difficulty: MEDIUM** ✅ COMPLETED
```

### Required Process: Explore → Plan → Code → Confirm

1. **Explore**: 
   - **FIRST**: Save task in TODO.md with date and difficulty
   - Read relevant files BEFORE writing code
   - Understand complete problem context
   - Identify dependencies and impacts

2. **Plan**:
   - Use extended thinking for complex tasks
   - Create detailed plan before implementing
   - Consider edge cases and validations

3. **Code**:
   - Follow established patterns in the codebase
   - Verify during implementation
   - Include tests where appropriate

4. **Confirm**:
   - Run validation commands before commit
   - Update documentation if necessary
   - **MANDATORY**: Mark task as completed in TODO.md

## Code Patterns and Architecture

### Wasp-Specific Patterns

#### Routes and Pages (main.wasp)
```wasp
route DashboardRoute { path: "/dashboard", to: DashboardPage }
page DashboardPage {
  authRequired: true,
  component: import DashboardPage from "@src/dashboard/DashboardPage"
}
```

#### Queries and Actions (main.wasp)
```wasp
query getPaginatedUsers {
  fn: import { getPaginatedUsers } from "@src/user/operations",
  entities: [User]
}

action updateUser {
  fn: import { updateUser } from "@src/user/operations",
  entities: [User]
}
```

### React Component Patterns

```typescript
// Standard component pattern for dashboard
// src/dashboard/components/[Component].tsx

interface ComponentProps {
  clubId?: string;
  onAction?: (data: ActionData) => void;
  className?: string;
  loading?: boolean;
}

export const Component: React.FC<ComponentProps> = ({
  clubId,
  onAction,
  className = '',
  loading = false
}) => {
  const { data: user } = useAuth();
  
  return (
    <div className={`component-container ${className}`}>
      {/* Component content */}
    </div>
  );
};
```

### Database Patterns (Prisma)

```typescript
// Multi-tenant pattern - all tables include clubId when needed
model Booking {
  id      String @id @default(uuid())
  clubId  String // For multi-tenant isolation
  userId  String
  courtId String
  
  user    User   @relation(fields: [userId], references: [id])
  // ... other fields
  
  @@index([clubId, date]) // Optimized queries
}
```

## Critical Business Considerations

### Multi-Tenant Architecture
- Each club is an independent tenant
- Complete data isolation between clubs
- Custom configuration per club
- Independent billing per club

### Roles and Permissions
```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',    // Platform administrator
  CLUB_OWNER = 'club_owner',      // Club owner
  CLUB_ADMIN = 'club_admin',      // Club administrator
  CLUB_STAFF = 'club_staff',      // Club staff
  CLUB_MEMBER = 'club_member'     // Club member (public page only)
}
```

### Priority Development Phases

#### MVP (Weeks 1-8)
1. **Metrics and Main Dashboard** (Weeks 1-3)
2. **Match Management** (Weeks 4-5) 
3. **Communication System** (Week 6)
4. **Public Playtomic-style Page** (Week 7)
5. **Billing and Configuration** (Week 8)

#### Future Improvements (Post-MVP)
- Classes and training
- Leagues and competitions
- Tournaments
- WordPress plugin integration
- Native mobile app

## Key Reminders

### For Claude Code

1. **B2B Focus**: Always think from club administrator perspective
2. **Dashboard first**: Administrative interface is primary functionality
3. **Public page secondary**: Simple and effective, not competing with Playtomic
4. **Business management**: Tools to optimize club operations
5. **TODO.md mandatory**: Never start without registering, never finish without marking
6. **Auto-checkpoint configured**: DO NOT reconfigure auto-commit system unless requested

### Validation Questions

Before implementing any functionality, ask:
- Does this help club administrators manage their business better?
- Is it intuitive for non-technical staff?
- Does it generate measurable value for the club?
- Is it aligned with the B2B model?

---

**Final Reminder**: PadelClub Manager is a management tool for clubs, not a player app. Success is measured by operational efficiency and profitability of clubs using the platform.

