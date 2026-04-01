const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4173;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'risk-compliance-dashboard' });
});

app.get('/api/ai-feed', (_req, res) => {
  db.all(
    `SELECT id, message, created_at FROM ai_feed ORDER BY datetime(created_at) DESC LIMIT 30`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to load AI feed' });
      return res.json(rows);
    }
  );
});

app.post('/api/ai-feed', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  db.run(`INSERT INTO ai_feed(message) VALUES (?)`, [message], function onInsert(err) {
    if (err) return res.status(500).json({ error: 'Failed to create feed item' });
    return res.status(201).json({ id: this.lastID, message });
  });
});

app.get('/api/alerts', (_req, res) => {
  db.all(
    `SELECT id, module, severity, message, status, created_at FROM alerts ORDER BY datetime(created_at) DESC LIMIT 100`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to load alerts' });
      return res.json(rows);
    }
  );
});

app.post('/api/alerts', (req, res) => {
  const { module, severity, message } = req.body;
  if (!module || !severity || !message) {
    return res.status(400).json({ error: 'module, severity, message are required' });
  }

  db.run(
    `INSERT INTO alerts(module, severity, message) VALUES (?, ?, ?)`,
    [module, severity, message],
    function onInsert(err) {
      if (err) return res.status(500).json({ error: 'Failed to create alert' });
      return res.status(201).json({ id: this.lastID, module, severity, message });
    }
  );
});

app.post('/api/actions', (req, res) => {
  const { actionType, payload } = req.body;
  if (!actionType) return res.status(400).json({ error: 'actionType is required' });

  db.run(
    `INSERT INTO action_log(action_type, payload) VALUES (?, ?)`,
    [actionType, JSON.stringify(payload || {})],
    function onInsert(err) {
      if (err) return res.status(500).json({ error: 'Failed to save action' });
      return res.status(201).json({ id: this.lastID, actionType });
    }
  );
});

app.get('/api/actions', (_req, res) => {
  db.all(
    `SELECT id, action_type, payload, created_at FROM action_log ORDER BY datetime(created_at) DESC LIMIT 100`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to load action log' });
      return res.json(rows.map((r) => ({ ...r, payload: JSON.parse(r.payload || '{}') })));
    }
  );
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Risk & Compliance Dashboard running on http://localhost:${PORT}`);
});
