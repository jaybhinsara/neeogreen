// Precomputes the globe's land/ocean wireframe once, so browsers download a
// small ready-made mesh instead of splitting ~44k triangles on every visit.
// Run after changing the land mask or the mesh detail:
//   node scripts/build-globe-mesh.mjs
//
// Output: public/globe/mesh-<detail>.bin (little-endian), read by
// components/GlobeScene.tsx:
//   Uint32[5]  vertCount, landTriIndexCount, landEdgeIndexCount,
//              oceanEdgeVertCount, oceanDotCount
//   Int16[]    unit-sphere vertices of the dense mesh (x, y, z × 32767)
//   Uint16[]   land triangle indices
//   Uint16[]   land edge index pairs (each shared edge once)
//   Int16[]    ocean edge endpoints of the sparse mesh (pairs of x, y, z)
//   Int16[]    ocean dot positions of the sparse mesh
import { mkdirSync, writeFileSync } from "node:fs";
import { IcosahedronGeometry } from "three";
import { LAND_MASK_BASE64, LAND_MASK_HEIGHT, LAND_MASK_WIDTH } from "../lib/land-mask.ts";

const DENSE_DETAILS = [46, 34]; // desktop, touch devices
const SPARSE_DETAIL = 7;
const DEG = Math.PI / 180;

const mask = Buffer.from(LAND_MASK_BASE64, "base64");

function isLand(lat, lon) {
  const x = Math.min(LAND_MASK_WIDTH - 1, Math.floor(((lon + 180) / 360) * LAND_MASK_WIDTH));
  const y = Math.min(LAND_MASK_HEIGHT - 1, Math.max(0, Math.floor(((90 - lat) / 180) * LAND_MASK_HEIGHT)));
  const i = y * LAND_MASK_WIDTH + x;
  return ((mask[i >> 3] >> (i & 7)) & 1) === 1;
}

// Each icosphere triangle is land or ocean by its center. Vertices are
// merged (the geometry repeats them per triangle) and every edge is kept
// once, so shared edges aren't drawn twice.
function partition(detail) {
  const geometry = new IcosahedronGeometry(1, detail);
  const pos = geometry.getAttribute("position").array;
  const key = (i) => `${pos[i].toFixed(4)},${pos[i + 1].toFixed(4)},${pos[i + 2].toFixed(4)}`;
  const vertexIndex = new Map();
  const verts = [];
  const indexOf = (i) => {
    const k = key(i);
    let v = vertexIndex.get(k);
    if (v === undefined) {
      v = verts.length / 3;
      vertexIndex.set(k, v);
      verts.push(pos[i], pos[i + 1], pos[i + 2]);
    }
    return v;
  };
  const landTris = [];
  const landEdges = new Map();
  const oceanEdges = new Map();
  const oceanDots = new Map();
  for (let i = 0; i < pos.length; i += 9) {
    const cx = pos[i] + pos[i + 3] + pos[i + 6];
    const cy = pos[i + 1] + pos[i + 4] + pos[i + 7];
    const cz = pos[i + 2] + pos[i + 5] + pos[i + 8];
    const len = Math.hypot(cx, cy, cz);
    const land = isLand(Math.asin(cy / len) / DEG, Math.atan2(cx, cz) / DEG);
    const corners = [i, i + 3, i + 6];
    const ids = corners.map(indexOf);
    if (land) landTris.push(...ids);
    for (const [a, b] of [
      [0, 1],
      [1, 2],
      [2, 0],
    ]) {
      const lo = Math.min(ids[a], ids[b]);
      const hi = Math.max(ids[a], ids[b]);
      (land ? landEdges : oceanEdges).set(lo * 1e6 + hi, [lo, hi]);
      if (!land) oceanDots.set(ids[a], ids[a]);
    }
  }
  geometry.dispose();
  return { verts, landTris, landEdges: [...landEdges.values()].flat(), oceanEdges: [...oceanEdges.values()], oceanDots: [...oceanDots.keys()] };
}

const q = (v) => Math.round(Math.max(-1, Math.min(1, v)) * 32767);

const sparse = partition(SPARSE_DETAIL);
const sparsePos = (i) => [q(sparse.verts[i * 3]), q(sparse.verts[i * 3 + 1]), q(sparse.verts[i * 3 + 2])];
const oceanEdgeVerts = sparse.oceanEdges.flatMap(([a, b]) => [...sparsePos(a), ...sparsePos(b)]);
const oceanDotVerts = sparse.oceanDots.flatMap(sparsePos);

mkdirSync(new URL("../public/globe/", import.meta.url), { recursive: true });
for (const detail of DENSE_DETAILS) {
  const dense = partition(detail);
  // Only vertices the land mesh uses, renumbered compactly.
  const used = new Map();
  const remap = (v) => {
    if (!used.has(v)) used.set(v, used.size);
    return used.get(v);
  };
  const landTris = dense.landTris.map(remap);
  const landEdges = dense.landEdges.map(remap);
  if (used.size > 65535) throw new Error(`detail ${detail}: ${used.size} vertices exceed Uint16 indices`);
  const verts = new Int16Array(used.size * 3);
  for (const [old, idx] of used) for (let k = 0; k < 3; k++) verts[idx * 3 + k] = q(dense.verts[old * 3 + k]);

  const header = new Uint32Array([used.size, landTris.length, landEdges.length, oceanEdgeVerts.length / 3, oceanDotVerts.length / 3]);
  const parts = [header, verts, new Uint16Array(landTris), new Uint16Array(landEdges), new Int16Array(oceanEdgeVerts), new Int16Array(oceanDotVerts)];
  const out = Buffer.concat(parts.map((p) => Buffer.from(p.buffer, p.byteOffset, p.byteLength)));
  const file = new URL(`../public/globe/mesh-${detail}.bin`, import.meta.url);
  writeFileSync(file, out);
  console.log(
    `mesh-${detail}.bin: ${(out.length / 1024).toFixed(0)} KB — ${used.size} verts, ${landTris.length / 3} land tris, ${landEdges.length / 2} land edges, ${oceanEdgeVerts.length / 6} ocean edges, ${oceanDotVerts.length / 3} ocean dots`,
  );
}
