import type { MetadataRoute } from "next";
import { getEnabledEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getEnabledEvents();

  const eventEntries: MetadataRoute.Sitemap = events.map((e) => ({
    url: `https://closerinti.me/${e.id}`,
    priority: 0.7,
  }));

  return [
    {
      url: "https://closerinti.me",
      priority: 1.0,
    },
    ...eventEntries,
  ];
}
