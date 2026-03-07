import { readFileSync } from "fs";
import { join } from "path";
import { getStore } from "@netlify/blobs";

const eventsPath = join(__dirname, "..", "data", "events.json");
const raw = JSON.parse(readFileSync(eventsPath, "utf-8"));

// Strip fields not needed at runtime (uuid, creation_ts, editing_ts)
const events = raw.map((e: Record<string, unknown>) => ({
  id: e.id,
  name: e.name,
  year: e.year,
  month: e.month ?? null,
  day: e.day ?? null,
  type: e.type,
  enabled: e.enabled,
  plural: e.plural,
  link: e.link ?? null,
}));

// Read siteID from .netlify/state.json and token from ~/.config/netlify/config.json
function getNetlifyCredentials(): { siteID: string; token: string } {
  const statePath = join(__dirname, "..", ".netlify", "state.json");
  const state = JSON.parse(readFileSync(statePath, "utf-8"));
  const siteID = state.siteId;
  if (!siteID) throw new Error("No siteId in .netlify/state.json — run 'netlify link' first");

  const configPath = join(
    process.env.HOME || process.env.USERPROFILE || "",
    ".config", "netlify", "config.json"
  );
  const config = JSON.parse(readFileSync(configPath, "utf-8"));
  const token = config.users?.[config.userId]?.auth?.token;
  if (!token) throw new Error("No auth token found — run 'netlify login' first");

  return { siteID, token };
}

async function main() {
  const { siteID, token } = getNetlifyCredentials();
  const store = getStore({ name: "events", siteID, token });
  await store.setJSON("all", events);
  console.log(`Seeded ${events.length} events to Netlify Blobs "events/all"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
