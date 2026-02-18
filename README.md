# CashCount PWA

A Progressive Web App for counting and tracking tithing and donation envelopes. Built with React 19 + TypeScript + Tailwind CSS.

> This is the PWA version of [CashCount iOS](https://github.com/aylabyuk/cashcount) — same features, runs on any device with a browser.

## Purpose

Built for bishopric members who collect and count tithing and other donations. The app streamlines the process of opening envelopes, recording cash bills by denomination, coins, and cheques, and tallying totals per envelope and per session.

## Features

- **Per-denomination bill counting** with +/- buttons ($100, $50, $20, $10, $5)
- **Coins and cheques** tracked as flat amounts per envelope
- **Live totals** — envelope totals and session grand totals update in real time
- **Session management** — one session per Sunday, with full denomination breakdown in the session report
- **Session locking** — sessions become read-only after the following Sunday
- **Delete confirmation** — sessions and envelopes require confirmation before deletion
- **Dark/Light mode** — toggle between system, light, and dark themes in Settings
- **Installable PWA** — add to home screen on any device, works offline
- **Responsive** — designed for mobile, tablet, and desktop
- **Persistent storage** — all data saved locally using localStorage (backend API planned)

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool, dev server)
- **Tailwind CSS v4** (styling)
- **Redux Toolkit** (state management, RTK Query ready for future API)
- **React Router v7** (client-side routing)
- **vite-plugin-pwa** (service worker, manifest, installability)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the dev server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Deployment

Deploy to Vercel, Netlify, or any static hosting:

```
npm run build
# Upload the `dist/` directory
```

For Vercel, connect the repo and it deploys automatically on push.

## Project Structure

```
src/
├── main.tsx                  # Entry point, Redux provider
├── App.tsx                   # Router setup
├── store/
│   ├── index.ts              # Redux store config + localStorage sync
│   ├── sessionsSlice.ts      # Sessions CRUD reducers
│   └── settingsSlice.ts      # Theme preference
├── pages/
│   ├── SessionsListPage.tsx  # Home — list all sessions
│   ├── SessionDetailPage.tsx # Session detail — totals + envelopes
│   ├── EnvelopeFormPage.tsx  # Edit existing envelope
│   └── SettingsPage.tsx      # Theme toggle
├── components/
│   ├── Layout.tsx            # App shell — header, nav, theme
│   ├── DenominationRow.tsx   # +/- stepper for a bill denomination
│   ├── CurrencyField.tsx     # Decimal input for coins/cheques
│   ├── TotalsSummary.tsx     # Session totals breakdown
│   ├── AddEnvelopeModal.tsx  # Modal for adding new envelope
│   └── ConfirmDialog.tsx     # Reusable confirmation modal
└── utils/
    ├── currency.ts           # Format cents to $X.XX
    └── date.ts               # Sunday calculation, lock check
```

## Notes

- Currency amounts are stored as **integer cents** to avoid floating-point rounding errors.
- Sessions are automatically dated to the current (or most recent) Sunday.
- Redux state is synced to localStorage on every change — data persists across refreshes.
- RTK Query is included for future backend API integration.

## Related

- [CashCount iOS](https://github.com/aylabyuk/cashcount) — native SwiftUI version of this app
