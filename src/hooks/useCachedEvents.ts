"use client";

import { useState, useEffect } from "react";
import type { Event } from "@/lib/types";
import { getCacheDb } from "@/lib/cache-db";

export function useCachedEvents(serverEvents: Event[]): Event[] {
  const [events, setEvents] = useState(serverEvents);

  useEffect(() => {
    if (serverEvents.length > 0) {
      // Cache the server events (non-blocking)
      getCacheDb()
        .then((db) => db.cachedEvents.bulkPut(serverEvents))
        .catch((err) => console.warn("Failed to cache events:", err));
      setEvents(serverEvents);
    } else {
      // Offline — try to load from cache
      getCacheDb()
        .then((db) => db.cachedEvents.toArray())
        .then((cached) => {
          if (cached.length > 0) setEvents(cached);
        })
        .catch((err) => console.warn("Failed to load cached events:", err));
    }
  }, [serverEvents]);

  return events;
}
