import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getEventsStore } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";
import { EVENT_TYPES } from "@/lib/types";
import type { Event } from "@/lib/types";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getEventsStore();
  const events: Event[] = (await store.get("all", { type: "json" })) || [];
  return NextResponse.json(events);
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, ...fields } = body as {
    id: number;
    name?: string; year?: number; month?: number | null; day?: number | null;
    type?: string; plural?: number; link?: string | null; enabled?: number;
  };

  if (typeof id !== "number") {
    return NextResponse.json({ error: "Event id is required" }, { status: 400 });
  }

  // Validate fields
  const WIKIPEDIA_RE = /^https:\/\/[a-z]{2,}\.wikipedia\.org\/wiki\/[A-Za-z0-9_()%,.\-]+$/;
  if (fields.name !== undefined && (typeof fields.name !== "string" || !fields.name.trim() || fields.name.length > 200)) {
    return NextResponse.json({ error: "Invalid name: must be a non-empty string (max 200 chars)" }, { status: 400 });
  }
  if (fields.year !== undefined && (typeof fields.year !== "number" || !Number.isInteger(fields.year) || fields.year === 0)) {
    return NextResponse.json({ error: "Invalid year: must be a non-zero integer" }, { status: 400 });
  }
  if (fields.month !== undefined && fields.month !== null && (typeof fields.month !== "number" || fields.month < 1 || fields.month > 12)) {
    return NextResponse.json({ error: "Invalid month: must be 1-12 or null" }, { status: 400 });
  }
  if (fields.day !== undefined && fields.day !== null && (typeof fields.day !== "number" || fields.day < 1 || fields.day > 31)) {
    return NextResponse.json({ error: "Invalid day: must be 1-31 or null" }, { status: 400 });
  }
  if (fields.type !== undefined && (typeof fields.type !== "string" || !EVENT_TYPES.includes(fields.type as typeof EVENT_TYPES[number]))) {
    return NextResponse.json({ error: "Invalid type: must be one of " + EVENT_TYPES.join(", ") }, { status: 400 });
  }
  if (fields.enabled !== undefined && fields.enabled !== 0 && fields.enabled !== 1) {
    return NextResponse.json({ error: "Invalid enabled: must be 0 or 1" }, { status: 400 });
  }
  if (fields.plural !== undefined && fields.plural !== 0 && fields.plural !== 1) {
    return NextResponse.json({ error: "Invalid plural: must be 0 or 1" }, { status: 400 });
  }
  if (fields.link !== undefined && fields.link !== null && (typeof fields.link !== "string" || !WIKIPEDIA_RE.test(fields.link))) {
    return NextResponse.json({ error: "Invalid link: must be a valid Wikipedia URL or null" }, { status: 400 });
  }

  const store = getEventsStore();
  const events: Event[] = (await store.get("all", { type: "json" })) || [];
  const idx = events.findIndex((e) => e.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const updated = { ...events[idx] };
  if (fields.name !== undefined) updated.name = fields.name;
  if (fields.year !== undefined) updated.year = fields.year;
  if (fields.month !== undefined) updated.month = fields.month;
  if (fields.day !== undefined) updated.day = fields.day;
  if (fields.type !== undefined) updated.type = fields.type;
  if (fields.plural !== undefined) updated.plural = fields.plural;
  if (fields.link !== undefined) updated.link = fields.link;
  if (fields.enabled !== undefined) updated.enabled = fields.enabled;

  events[idx] = updated;
  await store.setJSON("all", events);
  revalidatePath("/", "layout");

  return NextResponse.json({ message: "Event updated", event: updated });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id } = body as { id: number };

  if (typeof id !== "number") {
    return NextResponse.json({ error: "Event id is required" }, { status: 400 });
  }

  const store = getEventsStore();
  const events: Event[] = (await store.get("all", { type: "json" })) || [];
  const filtered = events.filter((e) => e.id !== id);

  if (filtered.length === events.length) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  await store.setJSON("all", filtered);
  revalidatePath("/", "layout");
  return NextResponse.json({ message: "Event deleted" });
}
