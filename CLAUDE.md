# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bonsai Buddy is a Next.js 16 application for bonsai enthusiasts to track, manage, and share their bonsai collections. The app uses React 19, TypeScript, and Tailwind CSS 4 with shadcn/ui components.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start

# Run linter
pnpm lint
```

## Architecture

### App Structure (Next.js App Router)

- `app/` - Next.js App Router pages and layouts
  - `page.tsx` - Homepage with community feed
  - `layout.tsx` - Root layout with AuthProvider and global styles
  - Route groups: `/login`, `/signup`, `/profile`, `/search`, `/specimen/[id]`, `/info`, `/reset-password`

### Component Organization

- `components/ui/` - shadcn/ui components (Button, Card, Form, etc.)
- `components/layout/` - Layout components (Navbar, Footer)
- `components/bonsai/` - Domain-specific components (PostCard, BonsaiSpecimenCard)
- `components/providers/` - React context providers (AuthProvider)

### Key Files

- `lib/utils.ts` - Utility functions (cn for className merging)
- `lib/mock-data.ts` - Mock data for specimens and posts (replace with API calls)
- `hooks/` - Custom React hooks (use-toast, use-mobile)

### Path Aliases

TypeScript paths are configured with `@/*` pointing to the root:
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/hooks` → `./hooks`
- `@/app` → `./app`

## Styling

The project uses Tailwind CSS 4 with:
- CSS variables for theming (defined in `app/globals.css`)
- Dark mode support via CSS custom properties
- shadcn/ui "new-york" style preset
- `tw-animate-css` for animations
- OKLCH color space for color definitions

## Authentication

Currently uses a mock authentication system via `AuthProvider`:
- User state stored in localStorage with key `bonsai_user`
- Access via `useAuth()` hook
- Mock login/signup functions (replace with real API)
- No actual password validation currently

## Important Configuration

- **TypeScript**: `ignoreBuildErrors: true` is set in `next.config.mjs` - fix type errors before production
- **Images**: `unoptimized: true` is set - consider enabling optimization for production
- **Package Manager**: Uses pnpm (note the pnpm-lock.yaml)
- **shadcn/ui**: Configured in `components.json` with Lucide icons

## Data Flow

Currently all data is mocked:
- `mockSpecimens` and `mockPosts` from `lib/mock-data.ts`
- When implementing real backend, replace mock data imports with API calls
- Key types are defined inline in component files (BonsaiSpecimen, BonsaiPost)

## Adding shadcn/ui Components

The project uses shadcn/ui. To add new components, they should be placed in `components/ui/` following the shadcn/ui pattern with the configured "new-york" style.
