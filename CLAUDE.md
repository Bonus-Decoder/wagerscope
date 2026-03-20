# WagerScope

## Project Description

WagerScope is a Progressive Web App (PWA) that helps users calculate and understand wagering requirements for crypto casino bonuses. The primary target markets are Nigeria and Kenya.

The tool allows users to input bonus parameters (deposit amount, match percentage, wagering multiplier, game contributions) and get a clear breakdown of what they need to wager, expected value analysis, and recommendations.

## Tech Stack

- **Framework:** Next.js 14 (App Router, React Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui (Radix primitives)
- **PWA:** next-pwa (service worker, offline support)
- **Database:** Prisma ORM → Supabase (PostgreSQL)
- **Deployment target:** Vercel

## Architecture

```
app/
├── (marketing)/    # Landing pages, SEO content, public routes
├── (app)/          # Core calculator/tool routes (authenticated or not)
├── layout.tsx      # Root layout: dark theme, Inter font, mobile-first
├── globals.css     # Tailwind + shadcn/ui CSS variables
└── page.tsx        # Root page (redirects or landing)

components/
├── ui/             # shadcn/ui primitives (button, card, input, etc.)
└── ...             # Feature-specific components

lib/
├── utils.ts        # cn() helper, shared utilities
└── prisma.ts       # Prisma client singleton

prisma/
└── schema.prisma   # Database schema (Casino, Bonus models)

content/            # Static content, markdown, data files
public/
├── manifest.json   # PWA manifest
└── icons/          # PWA icons (192x192, 512x512)
```

## Code Conventions

- **Components:** PascalCase filenames, one component per file, co-locate types
- **Utilities/lib:** camelCase filenames
- **Imports:** Use `@/` path alias for all imports
- **Styling:** Tailwind utility classes; use `cn()` for conditional classes
- **Server vs Client:** Default to Server Components; add `"use client"` only when needed (interactivity, hooks, browser APIs)
- **Data fetching:** Server Components with async/await; no `useEffect` for data loading
- **Types:** Prefer interfaces for object shapes, types for unions; avoid `any`
- **Currency:** Always handle multi-currency (BTC, ETH, USDT, NGN, KES)
- **Mobile-first:** Design for small screens first, enhance for larger

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint
npx prisma studio # Browse database (requires DATABASE_URL)
```
