# Footy Scores

A Google Chrome extension displaying Olympic football (Paris 2024) match schedules and scores in the browser side panel. Built with React + TypeScript + Vite.

## Requirements

- [Node.js](https://nodejs.org/) v18+
- Google Chrome v114+ (required for Side Panel API)

## Setup

```bash
npm install
npm run build
```

Output goes to `dist/`.

### Other commands

| Command | Description |
|---|---|
| `npm run dev` | Watch mode — rebuilds on every file change |
| `npm run build` | Production build (also generates PNG icons) |
| `npm run icons` | Regenerate extension PNG icons only |
| `npm run typecheck` | TypeScript check without building |

## Installing in Chrome

1. Run `npm run build` to generate the `dist/` folder.
2. Open `chrome://extensions/`.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked** and select the `dist/` folder.
5. The extension appears as **Footy Scores**.

To reload after a rebuild: click the refresh icon (↺) on the extension card in `chrome://extensions/`.

## Features

- **Side panel** — opens on the right side of the browser, like DevTools
- **Match list** — all Paris 2024 Olympic football matches sorted by date, with scores loaded in parallel (per-card spinner while loading)
- **Filters** — toggle Men's / Women's; multiselect dropdown for stage (Group A–D, Quarter-finals, Semi-finals, Final)
- **Match menu (⋮)** — per-match dropdown with:
  - **Export JSON** — downloads match data as a `.json` file
  - **Open in new tab** — opens the match viewer page
- **Viewer page** — full-page view of the exported JSON with:
  - **Export JSON** — download the file
  - **Copy JSON** — copy formatted JSON to clipboard
  - **`?raw=true`** — pure JSON output (no HTML), useful for programmatic use

### Exported JSON format

```jsonc
{
  "competition": { "name": "Football", "season": "Paris 2024", "round": "Men's Final" },
  "venue": { "name": "Parc des Princes", "city": "Paris" },
  "kickoff": "2024-08-09T21:00:00+02:00",
  "status": "FT",
  "teams": { "home": "France", "away": "Spain" },
  "score": { "home": 2, "away": 1, "halfTime": { "home": 1, "away": 0 } },
  "scorers": [
    { "team": "France", "player": "Jean Dupont", "minute": "23'", "type": "open_play" }
  ],
  "lineups": {
    "home": { "team": "France", "formation": "4-3-3", "coach": "Thierry Henry", "startingXI": [...], "bench": [...] },
    "away": { "team": "Spain", "formation": "4-1-2-3", "coach": "Santi Denia", "startingXI": [...], "bench": [...] }
  }
}
```

## Data sources

| Endpoint | Used for |
|---|---|
| `SCH_StartList~comp=OG2024~disc=FBL` | Match schedule (teams, dates, venues) |
| `SEL_Events~comp=OG2024~disc=FBL` | Event dictionary (Men's / Women's, phases) |
| `RES_ByRSC_H2H~...~rscResult={matchCode}` | Match result (scores, lineups, goals) |

All endpoints from `stacy.olympics.com/OG2024/data/`.

## Project structure

```
footy-scores-2026/
├── public/
│   ├── manifest.json              # Chrome MV3 manifest
│   └── icons/                     # PNG icons (generated from icon.svg)
├── scripts/
│   └── generate-icons.mjs         # SVG → PNG icon generator (uses sharp)
├── src/
│   ├── background.ts              # Service worker — opens Side Panel
│   ├── config/
│   │   └── endpoints.ts           # API endpoint URLs
│   ├── hooks/
│   │   ├── useOlympicsData.ts     # Fetches schedule + events dict
│   │   └── useMatchResults.ts     # Fetches scores/lineups per match
│   ├── sidepanel/
│   │   ├── main.tsx               # React entry point
│   │   ├── App.tsx                # Root component
│   │   ├── Filters.tsx            # Men/Women toggle + phase dropdown
│   │   ├── MatchList.tsx          # Match list
│   │   ├── MatchCard.tsx          # Single match card
│   │   ├── MatchMenu.tsx          # Per-match ⋮ dropdown menu
│   │   ├── FootballIcon.tsx       # Paris 2024 pictogram SVG component
│   │   └── index.css              # Global styles
│   ├── types/
│   │   ├── api.ts                 # API response types
│   │   └── filters.ts             # Filter types and phase labels
│   ├── utils/
│   │   ├── matchCode.ts           # Gender/phase parsing from match code
│   │   └── exportMatch.ts         # Maps API data → export JSON format
│   └── viewer/
│       └── main.ts                # Viewer page logic (plain TS, no React)
├── sidepanel.html                 # Vite HTML entry for side panel
├── viewer.html                    # Vite HTML entry for viewer page
├── vite.config.ts
├── tsconfig.json
└── package.json
```
