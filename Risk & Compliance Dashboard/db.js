const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'compliance.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS ai_feed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module TEXT NOT NULL,
      severity TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS action_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action_type TEXT NOT NULL,
      payload TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.get(`SELECT COUNT(*) AS count FROM ai_feed`, (err, row) => {
    if (err) return;
    if (row.count === 0) {
      const seed = db.prepare('INSERT INTO ai_feed(message) VALUES (?)');
      [
        '[07:45] Gold price 2.3% decline — portfolio stress alert',
        '[07:42] 8 STR drafts pending MLRO review — 3 high priority',
        '[07:30] KYC expiry spike — 340 accounts expiring this Friday',
        '[07:15] Auction pipeline: Branch Thrissur-3 overdue by 4 days'
      ].forEach((m) => seed.run(m));
      seed.finalize();
    }
  });
});

module.exports = db;
