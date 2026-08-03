import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { SCHEMA, SCHEMA_VERSION } from './schema'

// Opened on first query, never at import time — `next build` imports Route
// Handlers to collect their config, and a build should not touch the database
// (same reasoning as the lazy transport in ../mail/mailer.js).
let db

function migrate(handle) {
  const current = handle.pragma('user_version', { simple: true })
  if (current >= SCHEMA_VERSION) return

  handle.exec(SCHEMA)
  handle.pragma(`user_version = ${SCHEMA_VERSION}`)
  console.log(`[DB] Schema migrated: v${current} → v${SCHEMA_VERSION}`)
}

function open() {
  // PM2 runs with `cwd: __dirname` (ecosystem.config.cjs), so the default lands
  // inside the deployment and survives `git pull` / `npm ci`.
  const dir = process.env.DATA_DIR || path.join(process.cwd(), 'data')
  fs.mkdirSync(dir, { recursive: true })

  const file = path.join(dir, 'skriptura.db')
  const handle = new Database(file)

  // WAL lets a reader run while a write is in flight; busy_timeout makes a
  // concurrent writer wait rather than throw SQLITE_BUSY.
  handle.pragma('journal_mode = WAL')
  handle.pragma('busy_timeout = 5000')
  handle.pragma('foreign_keys = ON')

  migrate(handle)
  console.log(`[DB] Opened ${file}`)
  return handle
}

export function getDb() {
  if (!db) db = open()
  return db
}
