import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { getEventsByIds } from "@/lib/events";
import { generateSentence } from "@/lib/sentence";
import { parseSegments } from "@/lib/url-params";

export const revalidate = 3600;

let fontCache: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  const res = await fetch(
    "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&display=swap"
  );
  const css = await res.text();
  const match = css.match(/src:\s*url\(([^)]+)\)/);
  if (!match) throw new Error("Could not find font URL");
  const fontRes = await fetch(match[1]);
  fontCache = await fontRes.arrayBuffer();
  return fontCache;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = searchParams.get("ids");

  let sentence = "";
  if (ids) {
    const rawIds = ids.split(",");
    const parsed = parseSegments(rawIds);
    if (parsed) {
      const serverEvents =
        parsed.serverIds.length > 0
          ? await getEventsByIds(parsed.serverIds)
          : [];
      const allEvents = [...serverEvents, ...parsed.customEvents];
      if (allEvents.length > 0) {
        sentence = generateSentence(allEvents);
      }
    }
  }

  const font = await getFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#8B2252",
          padding: "60px 80px",
        }}
      >
        {sentence ? (
          <div
            style={{
              color: "white",
              fontSize: sentence.length > 100 ? 36 : 48,
              fontFamily: "Source Serif 4",
              textAlign: "center",
              lineHeight: 1.4,
              maxWidth: "1040px",
            }}
          >
            {sentence}
          </div>
        ) : null}
        <div
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: 28,
            fontFamily: "Source Serif 4",
            position: "absolute",
            bottom: "40px",
          }}
        >
          #closerintime
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Source Serif 4",
          data: font,
          weight: 600,
          style: "normal",
        },
      ],
    }
  );
}
