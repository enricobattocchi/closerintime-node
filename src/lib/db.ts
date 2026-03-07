import Database from "better-sqlite3";
import { join } from "path";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = join(process.cwd(), "data", "events.db");
    db = new Database(dbPath, { readonly: true });
  }
  return db;
}
