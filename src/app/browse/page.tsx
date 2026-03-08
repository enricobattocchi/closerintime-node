import type { Metadata } from "next";
import { getEnabledEvents } from "@/lib/events";
import { ERAS, groupByEra } from "@/lib/eras";
import BrowseClient from "@/components/Browse/BrowseClient";

export const metadata: Metadata = {
  title: "Browse by era",
  description: "Explore historical events grouped by era.",
};

export const revalidate = 3600;

export default async function BrowsePage() {
  let events: Awaited<ReturnType<typeof getEnabledEvents>>;
  try {
    events = await getEnabledEvents();
  } catch {
    // Offline or fetch failed — client component will fall back to IndexedDB cache
    events = [];
  }
  const groups = groupByEra(events);

  // Serialize for client component
  const eraData = ERAS.map((era) => ({
    ...era,
    // Replace Infinity for JSON serialization
    minYear: era.minYear === -Infinity ? -99999 : era.minYear,
    maxYear: era.maxYear === Infinity ? 99999 : era.maxYear,
    events: groups.get(era.id) || [],
  }));

  return <BrowseClient eras={eraData} />;
}
