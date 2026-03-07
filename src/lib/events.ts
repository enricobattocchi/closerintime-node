import { getDb } from "./db";
import type { Event } from "./types";

export function getEventsByIds(ids: number[]): Event[] {
  const db = getDb();
  const placeholders = ids.map(() => "?").join(",");
  const rows = db
    .prepare(
      `SELECT id, name, year, month, day, type, enabled, plural, link
       FROM events WHERE id IN (${placeholders})`
    )
    .all(...ids) as Event[];
  return rows;
}

export function getEnabledEvents(): Event[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT id, name, year, month, day, type, enabled, plural, link
       FROM events WHERE enabled = 1 ORDER BY year, id`
    )
    .all() as Event[];
}
