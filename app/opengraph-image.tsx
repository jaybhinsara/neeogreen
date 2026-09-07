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
          backgroundColor: "#0b0f0d",
          backgroundImage:
            "radial-gradient(circle at 78% 30%, rgba(52,211,153,0.22), transparent 55%), radial-gradient(circle at 85% 75%, rgba(34,211,238,0.16), transparent 50%)",
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9ca9a3",
            marginBottom: 28,
            display: "flex",
          }}
        >
          Brand · Packaging · Digital — Surat, India
        </div>
        <div
          style={{
            fontSize: 108,
            fontFamily: "ClashDisplay",
            fontWeight: 600,
            textTransform: "uppercase",
            color: "#f4f7f5",
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
            color: "#9ca9a3",
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          Building brand systems — identity, eco packaging, and digital marketing — for food brands that want to be remembered.
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
