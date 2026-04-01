# Risk & Compliance Dashboard (Python backend + TypeScript frontend)

An Apple-style UI demo dashboard for gold-loan risk/compliance with persistent SQLite data.

## Stack

- **Backend:** Python + Flask + SQLite
- **Frontend:** TypeScript (`frontend/app.ts`) with compiled browser JS (`frontend/app.js`)
- **UI style:** Apple-inspired glassmorphism (clean, light, minimal)

## Persistence

SQLite file: `data/compliance.db`

Stored entities:
- `ai_feed`
- `alerts`
- `action_log`

## Run

```bash
cd "Risk & Compliance Dashboard"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python backend/app.py
```

Open: `http://localhost:4173`

## API

- `GET /api/health`
- `GET /api/ai-feed`
- `POST /api/ai-feed`
- `POST /api/alerts`
- `GET /api/actions`
- `POST /api/actions`
