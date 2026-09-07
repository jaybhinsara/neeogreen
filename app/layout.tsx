import type { Metadata } from "next";
import { clashDisplay, inter } from "./fonts";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeeoGreen — Packaging & Brand Studio",
  description:
    "NeeoGreen designs custom eco-friendly packaging, brand identity, and social presence for restaurants, cafes, cloud kitchens, and D2C food brands. Based in Surat, India.",
  icons: {
    icon: "/logo/favicon-source.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-primary text-ink-on-dark">
        <SmoothScroll />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
