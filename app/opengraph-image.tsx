import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const fontData = await readFile(join(process.cwd(), "public/fonts/ClashDisplay-Semibold.otf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#eeebe2",
          borderBottom: "24px solid #0a9a65",
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#0a9a65",
            marginBottom: 28,
            display: "flex",
          }}
        >
          AI Engineering · Web Development · Software
        </div>
        <div
          style={{
            fontSize: 108,
            fontFamily: "ClashDisplay",
            fontWeight: 600,
            textTransform: "uppercase",
            color: "#0b0f0d",
            letterSpacing: -2,
            lineHeight: 1,
            display: "flex",
          }}
        >
          NeeoGreen
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 28,
            maxWidth: 820,
            color: "#6b7069",
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          AI chatbots, LLM integrations and automation, alongside websites and custom software, for businesses everywhere.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "ClashDisplay", data: fontData, weight: 600, style: "normal" }],
    }
  );
}

export const alt = `${SITE.name} — ${SITE.tagline}`;
