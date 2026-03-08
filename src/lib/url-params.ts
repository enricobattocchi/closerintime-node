import type { Event } from "@/lib/types";
import { decodeCustomEvent } from "@/lib/custom-event-url";

export function parseSegments(rawIds: string[]): {
  serverIds: number[];
  customEvents: Event[];
} | null {
  if (rawIds.length < 1 || rawIds.length > 3) return null;

  const serverIds: number[] = [];
  const customEvents: Event[] = [];

  for (let i = 0; i < rawIds.length; i++) {
    const seg = decodeURIComponent(rawIds[i]);
    if (seg.startsWith("c:")) {
      const custom = decodeCustomEvent(seg, i);
      if (!custom) return null;
      customEvents.push(custom);
    } else {
      const id = Number(seg);
      if (!Number.isInteger(id) || id <= 0) return null;
      serverIds.push(id);
    }
  }

  return { serverIds, customEvents };
}
