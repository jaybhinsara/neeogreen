const LINE_COUNT = 7; // 6-column grid → 7 boundary lines

export function GridLines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden md:block"
    >
      <div className="relative mx-auto h-full max-w-[1440px]">
        <div className="relative mx-16 h-full">
          {Array.from({ length: LINE_COUNT }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-px bg-line-on-dark"
              style={{ left: `${(i / (LINE_COUNT - 1)) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
