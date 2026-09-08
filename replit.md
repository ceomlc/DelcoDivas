# Delco Divas Website

## Overview

The Delco Divas website is a bold, theatrical web application for a women's wellness collective that combines dance, Pilates, and community. Built with a modern full-stack architecture, the site features dramatic black-and-white design with gold accents, emphasizing visual impact and artistic presentation. The application handles event registrations, newsletter subscriptions, merchandise inquiries, and media showcase.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (replacing React Router)

**UI Component System**
- shadcn/ui component library (New York style variant) providing accessible, customizable components
- Radix UI primitives for headless, accessible UI components
- Tailwind CSS for utility-first styling with extensive custom theme configuration
- Custom design system emphasizing theatrical contrast: pure black (#000000), white (#FFFFFF), and elegant grays for subtle emphasis

**Typography Strategy**
- Playfair Display (serif) for dramatic headlines and branding
- Inter (sans-serif) for clean body text
- Google Fonts integration for web font loading

**State Management**
- TanStack Query (React Query) for server state management, caching, and data fetching
- React Hook Form with Zod validation for form state and validation
- React Context for sidebar and UI state where needed

**Design Philosophy**
The frontend implements a "digital stage" concept with:
- Luxury black and white monochrome palette with elegant gray accents
- Strategic gold accent (#D4AF37) for active navigation and all button backgrounds
- Asymmetric, grid-breaking layouts
- Generous whitespace and dramatic typography scaling
- Animation-rich interactions (hover effects, scroll animations, transitions)
- Video backgrounds and immersive hero sections

### Backend Architecture

**Server Framework**
- Express.js running on Node.js for the HTTP server
- TypeScript throughout for type safety
- ESM modules (type: "module" in package.json)

**API Design**
- RESTful endpoints under `/api` namespace
- Public resources (no auth required):
  - `/api/newsletter` - Newsletter subscription management
  - `/api/signup` - Event registration handling
  - `/api/contact` - Merchandise inquiries
  - `/api/reviews` - Review submission
  - `/api/events` - Public events list
  - `/api/merchandise` - Public merchandise list
  - `/api/founders` - Public founders list
  - `/api/media` - Public media gallery
  - `/api/settings` - Public site settings
- Admin-only resources (require authentication):
  - `/api/admin/login` - Admin authentication with rate limiting
  - `/api/admin/logout` - Session termination
  - `/api/admin/me` - Current session validation
  - `/api/admin/newsletters`, `/api/admin/signups`, `/api/admin/contacts`, `/api/admin/reviews` - CRUD operations
  - `/api/admin/events`, `/api/admin/merchandise`, `/api/admin/founders`, `/api/admin/media`, `/api/admin/settings` - Content management
- JSON request/response format
- Centralized error handling with meaningful error messages

**Admin Panel**
- Secure authentication with bcrypt password hashing (12 rounds)
- Rate limiting on login endpoint (5 attempts per 15 minutes)
- Session-based auth with HTTP-only, secure cookies
- PostgreSQL session store via connect-pg-simple
- Trust proxy enabled for Replit's reverse proxy
- Routes: `/admin` (login), `/admin/dashboard` (dashboard)
- Dashboard provides tabs for viewing newsletters, signups, contacts, and reviews
- **Live Updates**: Admin edits to merchandise, founders, events, media, and settings immediately appear on the public website through TanStack Query cache invalidation

**Database Layer**
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL as the database provider
- Schema-first approach with TypeScript types generated from Drizzle schemas
- Three main tables: `newsletters`, `signups`, `contacts`

**Database Schema Design**
- UUID primary keys generated via PostgreSQL `gen_random_uuid()`
- Timestamps for tracking creation dates
- Nullable fields for optional data (phone, message)
- Email validation through Zod schemas

**Development Architecture**
- Dual storage implementation: `MemStorage` for development/testing, PostgreSQL for production
- Vite middleware integration for seamless dev server experience
- Hot module replacement in development
- Request logging middleware for API debugging

### External Dependencies

**Database & ORM**
- **Neon PostgreSQL**: Serverless PostgreSQL database accessed via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe ORM with schema at `shared/schema.ts`
- **Drizzle Kit**: Migration management and schema pushing

**UI Component Libraries**
- **Radix UI**: Complete set of accessible primitives (accordion, dialog, dropdown, popover, toast, etc.)
- **shadcn/ui**: Pre-built component system built on Radix UI
- **Lucide React**: Icon library for consistent iconography

**Form Handling & Validation**
- **React Hook Form**: Performant form state management
- **Zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: Integration between React Hook Form and Zod

**Styling & Design**
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **clsx + tailwind-merge**: Conditional className composition

**Developer Experience**
- **Replit Plugins**: Development tooling including runtime error modal, cartographer, and dev banner
- **TypeScript**: Full type safety across client, server, and shared code
- **Path Aliases**: `@/` for client, `@shared/` for shared code, `@assets/` for attached assets

**Build & Deployment**
- **esbuild**: Server-side bundling for production
- **Vite**: Client-side bundling with optimized production builds
- Development and production build scripts with environment-specific configurations

**Static Assets**
- Design guidelines document defining visual system
- Product images stored in `attached_assets/` directory including:
  - Delco Divas signature crop tee (black and red variants)
  - Eagles green tee
  - Tush Push sweatpants
  - Event photos from past performances
  - Founder headshots
- Custom favicon support

**API Communication**
- Custom `apiRequest` wrapper for fetch API with error handling
- TanStack Query for caching and request deduplication
- Credentials included for session management