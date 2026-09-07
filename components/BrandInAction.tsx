import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { LeafIcon } from "./LeafIcon";
import { MicroTag } from "./MicroTag";
import { cn } from "@/lib/cn";

const PRODUCTS = [
  {
    key: "cup",
    label: "Paper cup",
    tag: { glyph: "build", text: "PLA-lined" },
    src: "/mockups/cup-depth.png",
    aspect: "aspect-square",
  },
  {
    key: "box",
    label: "Food box",
    tag: { glyph: "design", text: "Kraft stock" },
    src: "/mockups/box.jpg",
    aspect: "aspect-square",
  },
  {
    key: "bag",
    label: "Mailer bag",
    tag: { glyph: "build", text: "Compostable" },
    src: "/mockups/bag-depth.png",
    aspect: "aspect-square",
  },
  {
    key: "card",
    label: "Business card",
    tag: { glyph: "design", text: "FSC paper" },
    src: "/mockups/card.jpg",
    aspect: "aspect-[1.536]",
  },
] as const;

function Badge() {
  return (
    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-bg-primary/70 px-2.5 py-1.5 backdrop-blur-sm">
      <LeafIcon variant="mono-white" className="h-3 w-auto" />
      <span className="font-display text-[9px] font-semibold uppercase tracking-[-0.01em] text-ink-on-dark">
        NeeoGreen
      </span>
    </div>
  );
}

export function BrandInAction() {
  return (
    <section className="py-24 md:py-40">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <span className="text-xs uppercase tracking-[0.14em] text-muted-on-dark">
                The system in hand
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(32px,5vw,64px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink-on-dark">
                From screen to shelf
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm text-muted-on-dark">
              Our own identity, mocked up across the packaging formats we
              design every day — the same system every client leaves with.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 border-t border-line-on-dark pt-14 md:grid-cols-4 md:gap-6">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.key} delay={0.08 * i}>
              <div className="flex flex-col gap-3">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-xl border border-line-on-dark",
                    product.aspect
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- generated mockup photo, not a fixed remote asset */}
                  <img
                    src={product.src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <Badge />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-[0.1em] text-muted-on-dark">
                    {product.label}
                  </span>
                  <MicroTag glyph={product.tag.glyph}>{product.tag.text}</MicroTag>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
