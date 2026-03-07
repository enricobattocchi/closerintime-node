import { NextResponse } from "next/server";
import { getEnabledEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  const events = await getEnabledEvents();
  return NextResponse.json(events);
}
