import { NextResponse } from "next/server";
import { getEnabledEvents } from "@/lib/events";

export async function GET() {
  const events = getEnabledEvents();
  return NextResponse.json(events);
}
