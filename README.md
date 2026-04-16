# TrialFlow AI Demo

TrialFlow AI is a lightweight, interview-friendly demo SaaS dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Pages

- `/dashboard` - high-level KPIs and enrollment snapshot
- `/trial-sites` - list view of all trial sites
- `/trial-sites/[siteId]` - site detail page with cohorts and notes
- `/cohort-search-assistant` - mock assistant experience for cohort targeting

The root route (`/`) redirects to `/dashboard`.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture Notes

- App Router with route groups (`app/(app)/...`) for dashboard pages
- Shared shell layout with sidebar navigation
- Typed mock data in `lib/trial-sites.ts`
- Reusable UI pieces in `components/`

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
