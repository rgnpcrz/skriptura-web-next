// The schema lives in a JS module rather than a .sql file on purpose: a route
// handler is bundled, so an `import` of raw SQL (or a runtime readFileSync of a
// path relative to the source tree) is a deployment hazard. A string is not.
//
// Bump SCHEMA_VERSION when statements are added. Everything is `IF NOT EXISTS`,
// so re-running the whole script on an existing database is a no-op.
export const SCHEMA_VERSION = 1

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS inquiries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  token       TEXT    NOT NULL UNIQUE,   -- opaque handle held by the browser
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  lang        TEXT    NOT NULL,
  ip          TEXT,
  code_hash   TEXT,                      -- NULL once verified or exhausted
  attempts    INTEGER NOT NULL DEFAULT 0,
  codes_sent  INTEGER NOT NULL DEFAULT 1,
  last_code_at INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL,          -- epoch ms
  verified_at INTEGER,
  created_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_email_created ON inquiries(email, created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_ip_created    ON inquiries(ip, created_at);
`
