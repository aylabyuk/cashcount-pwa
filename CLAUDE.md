# CLAUDE.md

## Project Overview

CashCount PWA is a Progressive Web App for tracking tithing/donation envelope counting. Built for bishopric members. This is the web version of the [CashCount iOS app](https://github.com/aylabyuk/cashcount).

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — utility-first styling with class-based dark mode
- **Redux Toolkit** — state management (RTK Query ready for future API)
- **React Router v7** — client-side routing
- **vite-plugin-pwa** — service worker and manifest generation

## Build Instructions

```bash
npm install         # Install dependencies
npm run dev         # Start dev server
npm run build       # Production build to dist/
```

## Architecture

- **Redux store** with two slices: `sessionsSlice` (CRUD) and `settingsSlice` (theme)
- State is synced to `localStorage` on every change via `store.subscribe()`
- No backend yet — localStorage is the persistence layer, designed to swap to RTK Query endpoints later
- Currency stored as **integer cents** (e.g. $12.50 = 1250) to avoid floating-point errors
- All totals are computed from envelope data, never stored separately

## Key Conventions

- Bill denominations: $100, $50, $20, $10, $5 only. $2 and $1 are coins.
- One session per Sunday — enforced in `SessionsListPage`
- Sessions lock after the following Sunday — `isSessionLocked()` in `utils/date.ts`
- Session dates are YYYY-MM-DD strings, always set to the most recent Sunday
- Dark mode uses Tailwind's class strategy (`dark` class on `<html>`)

## File Layout

- `src/store/` — Redux store, slices, typed hooks
- `src/pages/` — route-level page components
- `src/components/` — reusable UI components
- `src/utils/` — helpers (currency formatting, date calculations)

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | SessionsListPage | Home, all sessions |
| `/session/:id` | SessionDetailPage | Session detail + envelopes |
| `/session/:id/envelope/:envelopeId` | EnvelopeFormPage | Edit envelope |
| `/settings` | SettingsPage | Theme toggle |
