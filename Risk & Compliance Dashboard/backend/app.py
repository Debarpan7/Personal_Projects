from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "compliance.db"

DATA_DIR.mkdir(parents=True, exist_ok=True)


def get_db() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS ai_feed (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module TEXT NOT NULL,
                severity TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'open',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS action_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action_type TEXT NOT NULL,
                payload TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        count = conn.execute("SELECT COUNT(*) AS count FROM ai_feed").fetchone()["count"]
        if count == 0:
            conn.executemany(
                "INSERT INTO ai_feed(message) VALUES (?)",
                [
                    ("[07:45] Gold price 2.3% decline — portfolio stress alert",),
                    ("[07:42] 8 STR drafts pending MLRO review — 3 high priority",),
                    ("[07:30] KYC expiry spike — 340 accounts expiring this Friday",),
                    ("[07:15] Auction pipeline: Branch Thrissur-3 overdue by 4 days",),
                ],
            )


app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="")
init_db()


@app.get("/")
def index() -> Any:
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/api/health")
def health() -> Any:
    return jsonify({"ok": True, "service": "risk-compliance-dashboard-python"})


@app.get("/api/ai-feed")
def get_ai_feed() -> Any:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, message, created_at FROM ai_feed ORDER BY datetime(created_at) DESC LIMIT 50"
        ).fetchall()
    return jsonify([dict(row) for row in rows])


@app.post("/api/ai-feed")
def create_ai_feed() -> Any:
    payload = request.get_json(force=True)
    message = payload.get("message")
    if not message:
        return jsonify({"error": "message is required"}), 400
    with get_db() as conn:
        cursor = conn.execute("INSERT INTO ai_feed(message) VALUES (?)", (message,))
        item_id = cursor.lastrowid
    return jsonify({"id": item_id, "message": message}), 201


@app.post("/api/alerts")
def create_alert() -> Any:
    payload = request.get_json(force=True)
    module = payload.get("module")
    severity = payload.get("severity")
    message = payload.get("message")
    if not module or not severity or not message:
        return jsonify({"error": "module, severity, message are required"}), 400
    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO alerts(module, severity, message) VALUES (?, ?, ?)",
            (module, severity, message),
        )
        alert_id = cursor.lastrowid
    return jsonify({"id": alert_id, "module": module, "severity": severity, "message": message}), 201


@app.post("/api/actions")
def create_action() -> Any:
    payload = request.get_json(force=True)
    action_type = payload.get("actionType")
    if not action_type:
        return jsonify({"error": "actionType is required"}), 400

    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO action_log(action_type, payload) VALUES (?, ?)",
            (action_type, json.dumps(payload.get("payload", {}))),
        )
        action_id = cursor.lastrowid
    return jsonify({"id": action_id, "actionType": action_type}), 201


@app.get("/api/actions")
def get_actions() -> Any:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, action_type, payload, created_at FROM action_log ORDER BY datetime(created_at) DESC LIMIT 100"
        ).fetchall()
    parsed = []
    for row in rows:
        item = dict(row)
        item["payload"] = json.loads(item["payload"] or "{}")
        parsed.append(item)
    return jsonify(parsed)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4173, debug=False)
