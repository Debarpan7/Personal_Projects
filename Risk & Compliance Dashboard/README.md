# Risk & Compliance Dashboard

Web app demo for a Gold Loan NBFC risk/compliance command center.

## What was added

- Dedicated folder: `Risk & Compliance Dashboard`
- Browser UI app in `public/index.html`
- Node/Express server in `server.js`
- SQLite database bootstrap in `db.js`
- Persistent DB file at runtime: `data/compliance.db`

## Database persistence

The app stores and persists:

- AI intelligence feed entries (`ai_feed`)
- Alerts (`alerts`)
- Action/event logs (`action_log`)

All writes are saved to `data/compliance.db` and remain between restarts.

## Run

```bash
cd "Risk & Compliance Dashboard"
npm install
npm start
```

Open: `http://localhost:4173`
