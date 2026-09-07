import { cn } from "@/lib/cn";

const SRC = {
  gradient: "/logo/icon.svg",
  "mono-white": "/logo/icon-mono-white.svg",
  "mono-black": "/logo/icon-mono-black.svg",
} as const;

export function LeafIcon({
  variant = "gradient",
  className,
}: {
  variant?: keyof typeof SRC;
  className?: string;
}) {
  // eslint-disable-next-line @next/next/no-img-element -- decorative brand mark, sized purely via CSS
  return <img src={SRC[variant]} alt="" aria-hidden="true" className={cn("h-6 w-auto", className)} />;
}
