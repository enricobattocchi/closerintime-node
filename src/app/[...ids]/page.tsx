import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getEventsByIds, getEnabledEvents } from "@/lib/events";
import { computeTimeline } from "@/lib/timeline-math";
import { generateSentence } from "@/lib/sentence";
import Chooser from "@/components/Chooser/Chooser";

interface PageProps {
  params: Promise<{ ids: string[] }>;
}

function parseIds(rawIds: string[]): number[] | null {
  if (rawIds.length < 1 || rawIds.length > 3) return null;
  const ids = rawIds.map(Number);
  if (ids.some((id) => !Number.isInteger(id) || id <= 0)) return null;
  return ids;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ids: rawIds } = await params;
  const ids = parseIds(rawIds);
  if (!ids) return { title: "closerintime" };

  const events = getEventsByIds(ids);
  if (events.length === 0) return { title: "closerintime" };

  const sentence = generateSentence(events);
  const title = sentence || "closerintime";

  return {
    title,
    description: title,
    openGraph: { title, description: title },
    twitter: { card: "summary", title, description: title },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { ids: rawIds } = await params;
  const ids = parseIds(rawIds);

  if (!ids) {
    redirect("/");
  }

  // Redirect to sorted ascending order for canonical URLs
  const sorted = [...ids].sort((a, b) => a - b);
  if (ids.some((id, i) => id !== sorted[i])) {
    redirect("/" + sorted.join("/"));
  }

  const events = getEventsByIds(ids);
  if (events.length === 0) {
    redirect("/");
  }

  const allEvents = getEnabledEvents();
  const timeline = computeTimeline(events);
  const sentence = generateSentence(events);
  const href = "/" + sorted.join("/");

  return (
    <main>
      <Chooser
        allEvents={allEvents}
        selectedEvents={events}
        serverTimeline={{ markers: timeline.markers, segments: timeline.segments }}
        serverSentence={sentence}
        serverHref={href}
      />
    </main>
  );
}
