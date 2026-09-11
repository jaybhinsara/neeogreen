import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { LeafIcon } from "./LeafIcon";
import { MicroTag } from "./MicroTag";
import { cn } from "@/lib/cn";

export const PRODUCTS = [
  {
    key: "cup",
    label: "Paper cup",
    tag: { glyph: "build" as const, text: "PLA-lined" },
    src: "/mockups/cup-depth.png",
    aspect: "aspect-square",
  },
  {
    key: "box",
    label: "Food box",
    tag: { glyph: "design" as const, text: "Kraft stock" },
    src: "/mockups/box.jpg",
    aspect: "aspect-square",
  },
  {
    key: "bag",
    label: "Mailer bag",
    tag: { glyph: "build" as const, text: "Compostable" },
    src: "/mockups/bag-depth.png",
    aspect: "aspect-square",
  },
  {
    key: "card",
    label: "Business card",
    tag: { glyph: "design" as const, text: "FSC paper" },
    src: "/mockups/card.jpg",
    aspect: "aspect-[1.536]",
  },
] as const;

export type ShowcaseProduct = (typeof PRODUCTS)[number];

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

export function ProductCard({ product }: { product: ShowcaseProduct }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-line-on-dark",
          product.aspect
        )}
      >
        <Image
          src={product.src}
          alt=""
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover"
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
  );
}

export function ProductShowcase({
  items = PRODUCTS,
}: {
  items?: readonly ShowcaseProduct[];
}) {
  return (
    <div
      className="mt-16 flex gap-4 overflow-x-auto border-t border-line-on-dark pt-14 [scrollbar-width:none] snap-x snap-mandatory scroll-pl-6 md:gap-6 [&::-webkit-scrollbar]:hidden"
    >
      {items.map((product, i) => (
        <Reveal
          key={product.key}
          delay={0.08 * i}
          className="w-[75%] shrink-0 snap-start sm:w-[45%] md:w-[24%]"
        >
          <ProductCard product={product} />
        </Reveal>
      ))}
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
              <span className="font-accent text-2xl italic text-muted-on-dark md:text-3xl">
                The system in hand
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(32px,5vw,64px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink-on-dark">
                From screen to shelf<span className="accent-gradient-text">.</span>
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

        <ProductShowcase />
      </Container>
    </section>
  );
}
