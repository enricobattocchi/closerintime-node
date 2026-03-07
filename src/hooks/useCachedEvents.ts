"use client";

import { useState, useEffect } from "react";
import Dexie from "dexie";
import type { Event } from "@/lib/types";

class CacheDB extends Dexie {
  cachedEvents!: Dexie.Table<Event, number>;

  constructor() {
    super("closerintime-cache");
    this.version(1).stores({
      cachedEvents: "id",
    });
  }
}

let cacheDb: CacheDB | null = null;
function getCacheDb() {
  if (!cacheDb) cacheDb = new CacheDB();
  return cacheDb;
}

export function useCachedEvents(serverEvents: Event[]): Event[] {
  const [events, setEvents] = useState(serverEvents);

  useEffect(() => {
    const db = getCacheDb();

    if (serverEvents.length > 0) {
      // Cache the server events (non-blocking)
      db.cachedEvents.bulkPut(serverEvents).catch(() => {});
      setEvents(serverEvents);
    } else {
      // Offline — try to load from cache
      db.cachedEvents
        .toArray()
        .then((cached) => {
          if (cached.length > 0) setEvents(cached);
        })
        .catch(() => {});
    }
  }, [serverEvents]);

  return events;
}
