# #closerintime

Visualize the time between historical events.

Pick up to three historical events and see them on a proportional timeline ending at *now*. The app generates comparison sentences like *"The Great Pyramid is closer in time to us than to the Big Bang"* and renders them as shareable links with correct Open Graph metadata.

## Tech stack

- **Next.js 16** (App Router, SSR, TypeScript)
- **SQLite** via better-sqlite3 (328 canonical events, read-only)
- **IndexedDB** via Dexie (user-added local events, stored in browser)
- **CSS Modules** with responsive horizontal/vertical timeline layout
- **MUI Icons** for event category icons
- **PWA** via @ducanh2912/next-pwa (service worker, offline support)

## Getting started

Requires Node.js 22+.

```bash
npm install
npm run seed   # creates data/events.db from data/events.json
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building for production

```bash
npm run build
npm start
```

The build uses `--webpack` to enable PWA service worker generation (Turbopack does not support the PWA plugin).

## Project structure

```
src/
  app/
    layout.tsx              # Root layout, metadata, fonts
    page.tsx                # Home (empty state)
    [...ids]/page.tsx       # SSR for /id1, /id1/id2, /id1/id2/id3
    api/events/route.ts     # GET all enabled events as JSON
  components/
    Chooser/                # Autocomplete search + add event form
    Timeline/               # Proportional horizontal/vertical timeline
    Sentence.tsx            # Comparison sentence as shareable link
    HelpModal.tsx           # Instructions modal
    SettingsModal.tsx       # Timespan format toggle
    CategoryIcon.tsx        # Maps event type to MUI icon
  lib/
    date-utils.ts           # UTC date creation, precise diffs, formatting
    timeline-math.ts        # Proportional segment computation
    sentence.ts             # Comparison sentence generation
    db.ts                   # SQLite singleton
    events.ts               # Server-side event queries
    types.ts                # TypeScript interfaces
  hooks/
    useLocalEvents.ts       # IndexedDB CRUD for personal events
    useSettings.ts          # localStorage for display preferences
  styles/                   # CSS Modules
data/
  events.json               # Canonical event data (328 events)
scripts/
  seed-db.ts                # Seeds SQLite from events.json
```

## How it works

- URLs like `/42/107` are server-rendered with `generateMetadata()` so link previews show the comparison sentence as the page title.
- IDs in the URL are always sorted ascending; out-of-order URLs redirect to the canonical form.
- User-added events get negative IDs and stay in IndexedDB — they never touch the server.
- The timeline switches from horizontal to vertical layout below 640px.

## License

ISC
