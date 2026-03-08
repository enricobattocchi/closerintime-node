import type { Event } from "./types";

type DexieTable = {
  bulkPut(items: Event[]): Promise<void>;
  toArray(): Promise<Event[]>;
};

let cacheDbPromise: Promise<{ cachedEvents: DexieTable }> | null = null;

export function getCacheDb(): Promise<{ cachedEvents: DexieTable }> {
  if (!cacheDbPromise) {
    cacheDbPromise = import("dexie").then(({ default: Dexie }) => {
      const db = new Dexie("closerintime-cache") as typeof Dexie.prototype & {
        cachedEvents: DexieTable;
      };
      db.version(1).stores({
        cachedEvents: "id",
      });
      return db as unknown as { cachedEvents: DexieTable };
    });
  }
  return cacheDbPromise;
}
