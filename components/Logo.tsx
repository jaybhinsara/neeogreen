import { cn } from "@/lib/cn";
import { LeafIcon } from "./LeafIcon";

export function Logo({
  className,
  iconClassName,
  textClassName,
}: {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LeafIcon className={cn("h-6 w-auto", iconClassName)} />
      <span
        className={cn(
          "font-display text-lg font-semibold uppercase tracking-[-0.02em] text-ink-on-dark",
          textClassName
        )}
      >
        NeeoGreen
      </span>
    </span>
  );
}
