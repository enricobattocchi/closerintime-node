"use client";

import { useState, useEffect, useCallback } from "react";
import Dexie from "dexie";

interface LocalEvent {
  id?: number;
  name: string;
  year: number;
  month: number | null;
  day: number | null;
  type: string;
  plural: number;
  link: string | null;
}

class CloserintimeDB extends Dexie {
  localevents!: Dexie.Table<LocalEvent, number>;

  constructor() {
    super("closerintime-local");
    this.version(1).stores({
      localevents: "++id, name, year",
    });
  }
}

let db: CloserintimeDB | null = null;
function getDb() {
  if (!db) db = new CloserintimeDB();
  return db;
}

export function useLocalEvents() {
  const [localEvents, setLocalEvents] = useState<LocalEvent[]>([]);

  const refresh = useCallback(async () => {
    const all = await getDb().localevents.toArray();
    setLocalEvents(all);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEvent = useCallback(
    async (event: Omit<LocalEvent, "id">) => {
      const dbId = await getDb().localevents.add(event);
      await refresh();
      return dbId as number;
    },
    [refresh]
  );

  const deleteEvent = useCallback(
    async (id: number) => {
      await getDb().localevents.delete(id);
      await refresh();
    },
    [refresh]
  );

  // Convert to Event interface with negative IDs
  const asEvents = localEvents.map((e) => ({
    id: -(e.id!),
    name: e.name,
    year: e.year,
    month: e.month,
    day: e.day,
    type: e.type,
    enabled: 1,
    plural: e.plural,
    link: e.link,
  }));

  return { localEvents: asEvents, addEvent, deleteEvent };
}
