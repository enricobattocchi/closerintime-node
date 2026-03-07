import { NextRequest, NextResponse } from "next/server";
import { getSubmissionsStore } from "@/lib/db";
import type { Submission } from "@/lib/types";

const WIKIPEDIA_RE = /^https:\/\/[a-z]{2,}\.wikipedia\.org\/wiki\/.+$/;
const MAX_PER_HOUR = 5;

const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hourAgo = now - 3600_000;
  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => t > hourAgo);
  rateLimitMap.set(ip, timestamps);
  if (timestamps.length >= MAX_PER_HOUR) return true;
  timestamps.push(now);
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limited. Max 5 submissions per hour." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, year, month, day, type, plural, link } = body as {
    name: unknown; year: unknown; month: unknown; day: unknown;
    type: unknown; plural: unknown; link: unknown;
  };

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof year !== "number" || !Number.isInteger(year) || year === 0) {
    return NextResponse.json({ error: "Valid year is required" }, { status: 400 });
  }
  if (month !== null && (typeof month !== "number" || month < 1 || month > 12)) {
    return NextResponse.json({ error: "Invalid month" }, { status: 400 });
  }
  if (day !== null && (typeof day !== "number" || day < 1 || day > 31)) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }
  const validTypes = ["art", "book", "building", "computer", "film", "history", "music", "pop culture", "science", "sport"];
  if (typeof type !== "string" || !validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }
  if (typeof link !== "string" || !WIKIPEDIA_RE.test(link)) {
    return NextResponse.json({ error: "A valid Wikipedia URL is required" }, { status: 400 });
  }

  const submission: Submission = {
    name: name.trim(),
    year,
    month: (month as number | null) ?? null,
    day: (day as number | null) ?? null,
    type,
    plural: plural === 1 ? 1 : 0,
    link,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  const key = `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const store = getSubmissionsStore();
  await store.setJSON(key, submission);

  return NextResponse.json({ message: "Submission received" }, { status: 201 });
}
