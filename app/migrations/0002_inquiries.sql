-- Event / tour inquiries submitted from the Pearl Event Hall website form.
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  alt_date TEXT,
  time_of_day TEXT,
  guest_count INTEGER,
  wants_tour INTEGER NOT NULL DEFAULT 0,
  contact_pref TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at);
