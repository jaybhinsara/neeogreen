import { LeafIcon } from "./LeafIcon";

const SEGMENTS = [
  "Restaurants",
  "Cafés",
  "Cloud Kitchens",
  "QSR Chains",
  "D2C Food Brands",
  "Export Orders",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {SEGMENTS.map((s) => (
        <span key={s} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-2xl uppercase tracking-[-0.01em] text-muted-on-dark md:px-10 md:text-4xl">
            {s}
          </span>
          <LeafIcon className="h-4 w-auto shrink-0 opacity-50 md:h-5" />
        </span>
      ))}
    </div>
  );
}

export function TrustedBy() {
  return (
    <div className="overflow-hidden border-y border-line-on-dark py-6 md:py-8">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row />
      </div>
    </div>
  );
}
