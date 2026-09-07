// Regenerates the NeeoGreen leaf icon SVGs into public/logo/.
// Geometry matches the confirmed "Balanced Wave" strand mark, rotated 30deg.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "logo");
mkdirSync(outDir, { recursive: true });

const W = 340, H = 560;
const N_STRANDS = 15, MAX_WIDTH = 200, STROKE_W = 3.4, BASE_FREQ = 1.5, AMP_SCALE = 1.0;
const LEFT_RATIO = 0.42, RIGHT_RATIO = 0.58;
const CX = W * 0.42;
const ANGLE_DEG = 30;

function widthProfile(t, a = 1.7, b = 2.6) {
  const peakT = a / (a + b);
  const peakVal = peakT ** a * (1 - peakT) ** b;
  return (t ** a * (1 - t) ** b) / peakVal;
}

function makeStrand(frac, freq, phase, amp, samples = 28, waveGrow = 0.6) {
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const s = i / samples;
    const t = s;
    const y = t * H;
    const w = widthProfile(t) * MAX_WIDTH;
    const baseX = CX + (-LEFT_RATIO + (LEFT_RATIO + RIGHT_RATIO) * frac) * w;
    const endTaper = Math.sin(Math.PI * s) ** waveGrow;
    const wave = amp * w * Math.sin(freq * Math.PI * s + phase) * endTaper;
    pts.push([baseX + wave, y]);
  }
  return pts;
}

function buildStrands() {
  const strands = [];
  for (let i = 0; i < N_STRANDS; i++) {
    const frac = i / (N_STRANDS - 1);
    const freq = BASE_FREQ + 1.3 * Math.sin(frac * Math.PI);
    const phase = frac * 3.4;
    const amp = AMP_SCALE * (0.05 + 0.16 * Math.sin(frac * Math.PI + 0.3));
    strands.push(makeStrand(frac, freq, phase, amp));
  }
  return strands;
}

function catmullRomToBezier(points, dec = 1) {
  const p = points, n = p.length;
  let d = `M${p[0][0].toFixed(dec)} ${p[0][1].toFixed(dec)} `;
  for (let i = 0; i < n - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(dec)} ${c1y.toFixed(dec)} ${c2x.toFixed(dec)} ${c2y.toFixed(dec)} ${p2[0].toFixed(dec)} ${p2[1].toFixed(dec)} `;
  }
  return d;
}

function rotatePoint([x, y], angleDeg, [px, py]) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = x - px, dy = y - py;
  return [
    px + dx * Math.cos(rad) - dy * Math.sin(rad),
    py + dx * Math.sin(rad) + dy * Math.cos(rad),
  ];
}

const strands = buildStrands();
const pivot = [CX, H / 2];

// tight bbox of the rotated artwork, padded for stroke width
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const strand of strands) {
  for (const pt of strand) {
    const [rx, ry] = rotatePoint(pt, ANGLE_DEG, pivot);
    minX = Math.min(minX, rx); maxX = Math.max(maxX, rx);
    minY = Math.min(minY, ry); maxY = Math.max(maxY, ry);
  }
}
const pad = STROKE_W;
minX -= pad; minY -= pad; maxX += pad; maxY += pad;
const vbW = maxX - minX, vbH = maxY - minY;

function strandPaths(gradId) {
  return strands
    .map((pts) => catmullRomToBezier(pts))
    .map((d) => `<path d="${d}" fill="none" stroke="${gradId}" stroke-width="${STROKE_W}" stroke-linecap="round"/>`)
    .join("");
}

function iconSvg({ stroke, gradientStops, gradId }) {
  const strokeRef = gradientStops ? `url(#${gradId})` : stroke;
  const defs = gradientStops
    ? `<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">${gradientStops}</linearGradient></defs>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX.toFixed(1)} ${minY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}">${defs}<g transform="rotate(${ANGLE_DEG} ${pivot[0]} ${pivot[1]})">${strandPaths(strokeRef)}</g></svg>`;
}

const gradientStops = `<stop offset="0%" stop-color="#34D399"/><stop offset="100%" stop-color="#22D3EE"/>`;

writeFileSync(join(outDir, "icon.svg"), iconSvg({ gradientStops, gradId: "neeogreenGradient" }));
writeFileSync(join(outDir, "icon-mono-white.svg"), iconSvg({ stroke: "#FFFFFF" }));
writeFileSync(join(outDir, "icon-mono-black.svg"), iconSvg({ stroke: "#000000" }));

// square, centered favicon source (extra breathing room on the short axis)
const side = Math.max(vbW, vbH) * 1.08;
const favMinX = minX - (side - vbW) / 2;
const favMinY = minY - (side - vbH) / 2;
const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${favMinX.toFixed(1)} ${favMinY.toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}"><defs><linearGradient id="neeogreenGradient" x1="0" y1="0" x2="1" y2="1">${gradientStops}</linearGradient></defs><g transform="rotate(${ANGLE_DEG} ${pivot[0]} ${pivot[1]})">${strandPaths("url(#neeogreenGradient)")}</g></svg>`;
writeFileSync(join(outDir, "favicon-source.svg"), favSvg);

console.log("Wrote icon.svg, icon-mono-white.svg, icon-mono-black.svg, favicon-source.svg");
console.log(`viewBox ${minX.toFixed(1)} ${minY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)} (aspect ${(vbW / vbH).toFixed(3)})`);
