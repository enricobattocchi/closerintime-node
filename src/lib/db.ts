import { getStore } from "@netlify/blobs";
import { readFileSync } from "fs";
import { join } from "path";

let credentials: { siteID: string; token: string } | null = null;
let credentialsLoaded = false;

function getNetlifyCredentials(): { siteID: string; token: string } | null {
  if (credentialsLoaded) return credentials;
  credentialsLoaded = true;

  try {
    const statePath = join(process.cwd(), ".netlify", "state.json");
    const state = JSON.parse(readFileSync(statePath, "utf-8"));
    const siteID = state.siteId;
    if (!siteID) return null;

    const configPath = join(
      process.env.HOME || process.env.USERPROFILE || "",
      ".config", "netlify", "config.json"
    );
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    const token = config.users?.[config.userId]?.auth?.token;
    if (!token) return null;

    credentials = { siteID, token };
    return credentials;
  } catch {
    return null;
  }
}

function getStoreByName(name: string) {
  // In production on Netlify, env vars are set and getStore(name) works.
  // In local dev, we need explicit credentials.
  const creds = getNetlifyCredentials();
  if (creds) {
    return getStore({ name, siteID: creds.siteID, token: creds.token });
  }
  return getStore(name);
}

export function getEventsStore() {
  return getStoreByName("events");
}

export function getSubmissionsStore() {
  return getStoreByName("submissions");
}
