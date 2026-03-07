import { getEventsStore } from "./db";
import type { Event } from "./types";

export async function getEnabledEvents(): Promise<Event[]> {
  const store = getEventsStore();
  const events: Event[] | null = await store.get("all", { type: "json" });
  return (events || []).filter((e) => e.enabled === 1);
}

export async function getEventsByIds(ids: number[]): Promise<Event[]> {
  const all = await getEnabledEvents();
  const idSet = new Set(ids);
  return all.filter((e) => idSet.has(e.id));
}
