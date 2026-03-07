import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join } from "path";

const eventsPath = join(__dirname, "..", "data", "events.json");
const dbPath = join(__dirname, "..", "data", "events.db");

const raw = JSON.parse(readFileSync(eventsPath, "utf-8"));

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER,
    day INTEGER,
    type TEXT NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    plural INTEGER NOT NULL DEFAULT 0,
    link TEXT,
    uuid TEXT,
    creation_ts TEXT,
    editing_ts TEXT
  )
`);

db.exec("DELETE FROM events");

const insert = db.prepare(`
  INSERT INTO events (id, name, year, month, day, type, enabled, plural, link, uuid, creation_ts, editing_ts)
  VALUES (@id, @name, @year, @month, @day, @type, @enabled, @plural, @link, @uuid, @creation_ts, @editing_ts)
`);

const insertMany = db.transaction((events: typeof raw) => {
  for (const e of events) {
    insert.run(e);
  }
});

insertMany(raw);

console.log(`Seeded ${raw.length} events into ${dbPath}`);
db.close();
