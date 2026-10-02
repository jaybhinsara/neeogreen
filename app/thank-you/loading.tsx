import { LeafIcon } from "@/components/LeafIcon";

// Shown for the brief moment between a successful send and the thank-you
// page appearing, so the hand-off never looks frozen.
export default function Loading() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-page" aria-busy="true">
      <LeafIcon className="h-14 w-auto animate-pulse" />
      <span className="label-mono text-muted">Sending you through&hellip;</span>
    </main>
  );
}
