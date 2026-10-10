/**
 * Generates the art-directed placeholder visuals for the portfolio.
 *
 *   node scripts/generate-visuals.mjs
 *
 * Every project gets a distinct generative composition rendered from SVG to
 * WebP (Next.js serves AVIF/WebP variants at runtime). Replace any file in /public/images with your real
 * work — keep the same file name, or update the paths in /lib/projects.ts.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/images");
const ACCENT = "#FF4D17";

// ── seeded random ─────────────────────────────────────────────
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r) => {
  const u = 1 - r();
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const frame = (w, h, defs, body, bg = "#070707") => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.85"/>
    </radialGradient>
    <filter id="blur-xl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${w / 18}"/></filter>
    <filter id="blur-l" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${w / 60}"/></filter>
    <filter id="blur-m" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${w / 220}"/></filter>
    <filter id="blur-s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${w / 900}"/></filter>
    ${defs}
  </defs>
  <rect width="100%" height="100%" fill="${bg}"/>
  ${body}
  <rect width="100%" height="100%" fill="url(#vignette)"/>
</svg>`;

// ── GSB — a constellation of connected nodes (relational data) ─
function nexus(w, h, seed, zoom = 1) {
  const r = rng(seed);
  const cx = w / 2, cy = h / 2;
  const pts = [];
  for (let i = 0; i < 320; i++) {
    const a = r() * Math.PI * 2;
    const d = Math.abs(gauss(r)) * h * 0.3 * zoom;
    pts.push([cx + Math.cos(a) * d * 1.5, cy + Math.sin(a) * d * 0.9, r()]);
  }
  let lines = "";
  const max = h * 0.11 * zoom;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1];
      const d = Math.hypot(dx, dy);
      if (d < max) {
        const o = (1 - d / max) * 0.5;
        lines += `<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" stroke="#fff" stroke-opacity="${o.toFixed(3)}" stroke-width="${(w / 1600).toFixed(2)}"/>`;
      }
    }
  }
  let nodes = "";
  for (const [x, y, t] of pts) {
    const hot = t > 0.94;
    const rad = (hot ? 4 : 1.6 + t * 1.8) * (w / 1600);
    nodes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(2)}" fill="${hot ? ACCENT : "#fff"}" fill-opacity="${hot ? 1 : 0.4 + t * 0.6}"/>`;
  }
  let grid = "";
  for (let x = 0; x <= w; x += w / 12) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#fff" stroke-opacity="0.04"/>`;
  for (let y = 0; y <= h; y += w / 12) grid += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#fff" stroke-opacity="0.04"/>`;
  const defs = `<radialGradient id="core"><stop offset="0" stop-color="${ACCENT}" stop-opacity="0.55"/><stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/></radialGradient>`;
  return frame(w, h, defs, `${grid}<ellipse cx="${cx}" cy="${cy}" rx="${w * 0.32}" ry="${h * 0.32}" fill="url(#core)"/>${lines}${nodes}`);
}

// ── NALOVEA — a soft, light-filled sphere (cosmetics still life)
function aether(w, h, seed, zoom = 1) {
  const r = rng(seed);
  const cx = w * (0.5 + (r() - 0.5) * 0.1), cy = h * 0.52;
  const R = h * 0.36 * zoom;
  const defs = `
    <radialGradient id="sphere" cx="35%" cy="30%" r="75%">
      <stop offset="0" stop-color="#f4f1ec"/>
      <stop offset="0.35" stop-color="#9c9aa6"/>
      <stop offset="0.7" stop-color="#26252b"/>
      <stop offset="1" stop-color="#08080a"/>
    </radialGradient>
    <radialGradient id="halo"><stop offset="0.6" stop-color="#d9dcf0" stop-opacity="0.25"/><stop offset="1" stop-color="#d9dcf0" stop-opacity="0"/></radialGradient>
    <linearGradient id="rim" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${ACCENT}"/><stop offset="0.4" stop-color="${ACCENT}" stop-opacity="0"/></linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a1f"/><stop offset="1" stop-color="#050505"/></linearGradient>`;
  let mist = "";
  for (let i = 0; i < 7; i++) {
    mist += `<ellipse cx="${w * r()}" cy="${h * (0.55 + r() * 0.4)}" rx="${w * (0.2 + r() * 0.3)}" ry="${h * (0.05 + r() * 0.08)}" fill="#cfd3e6" fill-opacity="${0.04 + r() * 0.06}" filter="url(#blur-l)"/>`;
  }
  return frame(
    w, h, defs,
    `<rect y="${h * 0.7}" width="${w}" height="${h * 0.3}" fill="url(#floor)"/>
     <line x1="0" y1="${h * 0.7}" x2="${w}" y2="${h * 0.7}" stroke="#fff" stroke-opacity="0.12"/>
     <circle cx="${cx}" cy="${cy}" r="${R * 1.9}" fill="url(#halo)"/>
     <ellipse cx="${cx}" cy="${h * 0.7 + R * 0.12}" rx="${R * 1.1}" ry="${R * 0.12}" fill="#000" fill-opacity="0.8" filter="url(#blur-l)"/>
     <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#sphere)"/>
     <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="url(#rim)" stroke-width="${w / 260}" filter="url(#blur-m)"/>
     ${mist}`,
    "#0b0b0e",
  );
}

// ── ORACLE — a dark disc with a glowing ring ──────────────────
function voidArt(w, h, seed, zoom = 1) {
  const r = rng(seed);
  const cx = w / 2, cy = h / 2;
  const R = h * 0.2 * zoom;
  const defs = `
    <linearGradient id="disk" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.1"/>
      <stop offset="0.3" stop-color="#ffd2b8"/>
      <stop offset="0.55" stop-color="#fff"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0.2"/>
    </linearGradient>`;
  let stars = "";
  for (let i = 0; i < 260; i++) stars += `<circle cx="${(r() * w).toFixed(1)}" cy="${(r() * h).toFixed(1)}" r="${(r() * 1.4 * (w / 1600)).toFixed(2)}" fill="#fff" fill-opacity="${(r() * 0.6).toFixed(2)}"/>`;
  return frame(
    w, h, defs,
    `${stars}
     <circle cx="${cx}" cy="${cy}" r="${R * 1.5}" fill="${ACCENT}" fill-opacity="0.35" filter="url(#blur-xl)"/>
     <ellipse cx="${cx}" cy="${cy}" rx="${R * 2.7}" ry="${R * 0.5}" fill="none" stroke="url(#disk)" stroke-width="${R * 0.22}" filter="url(#blur-m)"/>
     <ellipse cx="${cx}" cy="${cy}" rx="${R * 2.7}" ry="${R * 0.5}" fill="none" stroke="url(#disk)" stroke-width="${R * 0.05}"/>
     <circle cx="${cx}" cy="${cy}" r="${R * 1.12}" fill="none" stroke="#ffe3d3" stroke-width="${R * 0.08}" filter="url(#blur-m)"/>
     <circle cx="${cx}" cy="${cy}" r="${R * 1.04}" fill="none" stroke="#fff" stroke-width="${R * 0.015}"/>
     <circle cx="${cx}" cy="${cy}" r="${R}" fill="#000"/>
     <path d="M ${cx - R * 2.7} ${cy} A ${R * 2.7} ${R * 0.5} 0 0 0 ${cx + R * 2.7} ${cy}" fill="none" stroke="url(#disk)" stroke-width="${R * 0.07}"/>`,
    "#030303",
  );
}

// ── RPF LYON — a building slab at dusk (architecture, renovation)
function monolith(w, h, seed, zoom = 1) {
  const r = rng(seed);
  const horizon = h * 0.68;
  const sw = w * 0.13 * zoom, sh = h * 0.62 * zoom;
  const x = w * (0.46 + (r() - 0.5) * 0.06), y = horizon - sh;
  const depth = sw * 0.35;
  const defs = `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050505"/><stop offset="0.75" stop-color="#1c1714"/><stop offset="1" stop-color="#5a2a17"/>
    </linearGradient>
    <linearGradient id="face" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2a2a"/><stop offset="1" stop-color="#121212"/></linearGradient>
    <linearGradient id="side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0a0a"/><stop offset="1" stop-color="#000"/></linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151311"/><stop offset="1" stop-color="#050505"/></linearGradient>
    <linearGradient id="shadow" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.9"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>`;
  return frame(
    w, h, defs,
    `<rect width="${w}" height="${horizon}" fill="url(#sky)"/>
     <ellipse cx="${w * 0.25}" cy="${horizon}" rx="${w * 0.4}" ry="${h * 0.06}" fill="${ACCENT}" fill-opacity="0.5" filter="url(#blur-l)"/>
     <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#ground)"/>
     <line x1="0" y1="${horizon}" x2="${w}" y2="${horizon}" stroke="${ACCENT}" stroke-opacity="0.6" stroke-width="${w / 1400}"/>
     <polygon points="${x + sw},${horizon} ${x + sw + depth},${horizon - depth * 0.35} ${w * 1.1},${h * 0.95} ${x + sw * 0.4},${h}" fill="url(#shadow)"/>
     <rect x="${x}" y="${y}" width="${sw}" height="${sh}" fill="url(#face)"/>
     <polygon points="${x + sw},${y} ${x + sw + depth},${y - depth * 0.35} ${x + sw + depth},${horizon - depth * 0.35} ${x + sw},${horizon}" fill="url(#side)"/>
     <polygon points="${x},${y} ${x + depth},${y - depth * 0.35} ${x + sw + depth},${y - depth * 0.35} ${x + sw},${y}" fill="#3a3a3a"/>
     <line x1="${x}" y1="${y}" x2="${x}" y2="${horizon}" stroke="${ACCENT}" stroke-opacity="0.55" stroke-width="${w / 900}"/>
     <rect x="${x - sw * 1.6}" y="${horizon - h * 0.024}" width="${w * 0.0035}" height="${h * 0.024}" fill="#000"/>
     <circle cx="${x - sw * 1.6 + w * 0.00175}" cy="${horizon - h * 0.027}" r="${w * 0.0022}" fill="#000"/>`,
  );
}

// ── GIT — a branch graph: lanes, commits, merges ─────────────
function gitGraph(w, h, seed, zoom = 1) {
  const r = rng(seed);
  const u = w / 1600;
  const lanes = [0.5, 0.36, 0.64, 0.24].map((y) => h * (0.5 + (y - 0.5) * zoom));
  const step = (w / 22) * zoom;
  const sw = 2.4 * u;
  let paths = "";
  let dots = "";
  // main line
  paths += `<line x1="0" y1="${lanes[0]}" x2="${w}" y2="${lanes[0]}" stroke="#fff" stroke-opacity="0.85" stroke-width="${sw}"/>`;
  for (let x = step / 2; x < w; x += step) dots += `<circle cx="${x}" cy="${lanes[0]}" r="${7 * u}" fill="#070707" stroke="#fff" stroke-width="${sw}"/>`;
  // feature branches: fork from main, a few commits, merge back
  const branches = [
    { lane: 1, from: 3, to: 9, hot: true },
    { lane: 2, from: 6, to: 13, hot: false },
    { lane: 3, from: 10, to: 16, hot: false },
    { lane: 1, from: 15, to: 20, hot: false },
  ];
  for (const b of branches) {
    const x0 = step / 2 + b.from * step, x1 = step / 2 + b.to * step;
    const y = lanes[b.lane];
    const col = b.hot ? ACCENT : "#fff";
    const op = b.hot ? 1 : 0.45;
    const c = step * 0.8;
    paths += `<path d="M${x0} ${lanes[0]} C${x0 + c} ${lanes[0]}, ${x0} ${y}, ${x0 + c} ${y} L${x1 - c} ${y} C${x1} ${y}, ${x1 - c} ${lanes[0]}, ${x1} ${lanes[0]}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${sw}"/>`;
    for (let x = x0 + c + step * 0.3; x < x1 - c; x += step * (0.8 + r() * 0.5)) {
      dots += `<circle cx="${x}" cy="${y}" r="${7 * u}" fill="#070707" stroke="${col}" stroke-opacity="${op}" stroke-width="${sw}"/>`;
    }
    if (b.hot) dots += `<circle cx="${x1}" cy="${lanes[0]}" r="${11 * u}" fill="${ACCENT}"/><circle cx="${x1}" cy="${lanes[0]}" r="${60 * u}" fill="${ACCENT}" fill-opacity="0.45" filter="url(#blur-l)"/>`;
  }
  let grid = "";
  for (let x = step / 2; x < w; x += step) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#fff" stroke-opacity="0.035"/>`;
  return frame(w, h, "", grid + paths + dots, "#070707");
}

// ── LEGO4SCRUM — a top-down brick plate, sprint columns rising ─
function blocks(w, h, seed, zoom = 1) {
  const r = rng(seed);
  const cell = (w / 26) * zoom;
  const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1;
  // Each column has a "progress" height, like a burn-up chart built from bricks.
  const heights = Array.from({ length: cols }, (_, i) => Math.floor(rows * (0.15 + 0.6 * (i / cols)) + r() * 3));
  let out = "";
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * cell, y = h - (j + 1) * cell;
      const filled = j < heights[i];
      const hot = filled && j === heights[i] - 1 && i % 5 === 3;
      const fill = hot ? ACCENT : filled ? "#2a2826" : "#0c0c0c";
      const studFill = hot ? "#ff7a4d" : filled ? "#3a3734" : "#121212";
      out += `<rect x="${x + 1.5}" y="${y + 1.5}" width="${cell - 3}" height="${cell - 3}" fill="${fill}"/>`;
      out += `<circle cx="${x + cell / 2}" cy="${y + cell / 2}" r="${cell * 0.28}" fill="${studFill}" stroke="#000" stroke-opacity="0.35" stroke-width="${cell * 0.04}"/>`;
      if (filled) out += `<circle cx="${x + cell / 2 - cell * 0.07}" cy="${y + cell / 2 - cell * 0.07}" r="${cell * 0.12}" fill="#fff" fill-opacity="${hot ? 0.35 : 0.06}"/>`;
    }
  }
  return frame(w, h, "", out, "#050505");
}

// ── SNEAKERS — flowing contour lines ─────────────────────────
function halcyon(w, h, seed, zoom = 1) {
  const r = rng(seed);
  const bumps = Array.from({ length: 5 }, () => ({ x: r() * w, y: r() * h, s: (0.1 + r() * 0.18) * w * zoom, a: (r() - 0.3) * h * 0.25 }));
  let paths = "";
  const N = 64;
  for (let i = 0; i < N; i++) {
    const base = (i / (N - 1)) * h * 1.2 - h * 0.1;
    let d = "";
    for (let x = -20; x <= w + 20; x += w / 160) {
      let y = base;
      for (const b of bumps) {
        const dx = x - b.x, dy = base - b.y;
        y -= b.a * Math.exp(-(dx * dx + dy * dy) / (2 * b.s * b.s));
      }
      y += Math.sin(x / (w / 7) + i * 0.3) * h * 0.008;
      d += `${d ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    const hot = i === 38;
    paths += `<path d="${d}" fill="none" stroke="${hot ? ACCENT : "#fff"}" stroke-opacity="${hot ? 1 : 0.12 + 0.35 * Math.sin((i / N) * Math.PI)}" stroke-width="${(hot ? 2.2 : 1) * (w / 1600)}"/>`;
  }
  return frame(w, h, "", paths, "#080808");
}

// File names match the project slugs in /lib/projects.ts.
const projects = [
  ["nalovea", aether, 22],
  ["rpf-lyon", monolith, 44],
  ["gsb", nexus, 11],
  ["sneakers", halcyon, 66],
  ["oracle", voidArt, 33],
  ["git-github", gitGraph, 77],
  ["lego4scrum", blocks, 88],
];

async function render(svg, file, { quality = 80 } = {}) {
  const img = sharp(Buffer.from(svg));
  await img.clone().webp({ quality, effort: 5 }).toFile(path.join(OUT, `${file}.webp`));
  console.log("✓", file);
}

await mkdir(OUT, { recursive: true });
for (const [name, fn, seed] of projects) {
  await render(fn(2400, 1500, seed), name);
  await render(fn(1600, 2000, seed + 1, 1.35), `${name}-detail-1`);
  await render(fn(2400, 1350, seed + 2, 0.7), `${name}-detail-2`);
}
