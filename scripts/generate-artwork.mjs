/**
 * Generates the editorial artwork in /public/images.
 *
 * Every article in src/data/articles/* points at one of these files, so
 * swapping a generated plate for a real photograph is a one-line data edit.
 *
 *   node scripts/generate-artwork.mjs <slug>[:kind] ...
 *   node scripts/generate-artwork.mjs --all
 *
 * kinds:  editorial (default) · comic · plate
 *   editorial — abstract poster art for reported stories
 *   comic     — inked panel strips for the Comics section
 *   plate     — illustrated landscape plates for the Bible readings
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "..", "public", "images");
const W = 1600;
const H = 1067;

/* ── Palette ─────────────────────────────────────────────────────────────
   Strictly the brand: paper white, near-black ink, one red. No stray hues. */
const RED = "#D81E26";
const RED_DEEP = "#A0141A";
const INK = "#111114";

const palettes = {
  paper: { bg: "#FBFAF8", ink: INK, accent: RED, soft: "#E8E4DE" },
  bone: { bg: "#F3EFE8", ink: INK, accent: RED, soft: "#DED8CD" },
  sand: { bg: "#E9E1D5", ink: "#15120E", accent: RED_DEEP, soft: "#D2C7B6" },
  ink: { bg: INK, ink: "#FBFAF8", accent: "#F0333B", soft: "#2A2A31" },
  slate: { bg: "#1F1F26", ink: "#F4F1EC", accent: "#F0333B", soft: "#33333C" },
  scarlet: { bg: RED, ink: "#FFFFFF", accent: INK, soft: RED_DEEP },
};

/** Deterministic pseudo-random, so artwork never changes between runs. */
function rng(seed) {
  let s = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    s ^= seed.charCodeAt(i);
    s = Math.imul(s, 16777619) >>> 0;
  }
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

/* ── Editorial compositions ──────────────────────────────────────────── */

const editorial = {
  /** Heavy stacked bands broken by one offset red block. */
  stack: (p, r) => {
    let out = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;
    const bands = 5 + Math.floor(r() * 3);
    let y = 0;
    for (let i = 0; i < bands; i++) {
      const h = (H / bands) * (0.5 + r());
      const fill = i % 3 === 1 ? p.soft : p.ink;
      out += `<rect x="${W * (i % 2 ? 0.08 : 0)}" y="${y}" width="${W * (i % 2 ? 0.92 : 0.78)}" height="${h * 0.62}" fill="${fill}"/>`;
      y += h * 0.9;
    }
    out += `<rect x="${W * 0.52}" y="${H * (0.18 + r() * 0.2)}" width="${W * 0.4}" height="${H * 0.46}" fill="${p.accent}"/>`;
    return out;
  },

  /** One dominant disc under a fine concentric ring set. */
  orbit: (p, r) => {
    const cx = W * (0.34 + r() * 0.32);
    const cy = H * (0.42 + r() * 0.16);
    let out = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;
    out += `<circle cx="${cx}" cy="${cy}" r="${H * 0.36}" fill="${p.accent}"/>`;
    for (let i = 1; i <= 7; i++) {
      out += `<circle cx="${cx}" cy="${cy}" r="${H * (0.36 + i * 0.085)}" fill="none" stroke="${p.ink}" stroke-width="${i === 3 ? 9 : 2.5}" opacity="${0.9 - i * 0.09}"/>`;
    }
    out += `<rect x="0" y="${H * 0.86}" width="${W}" height="${H * 0.14}" fill="${p.ink}"/>`;
    return out;
  },

  /** Modular grid with a handful of cells knocked out in red. */
  gridfield: (p, r) => {
    const cols = 8;
    const rows = 5;
    let out = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const v = r();
        const fill = v > 0.86 ? p.accent : v > 0.62 ? p.ink : v > 0.44 ? p.soft : null;
        if (!fill) continue;
        const cw = W / cols;
        const ch = H / rows;
        out += `<rect x="${x * cw + 6}" y="${y * ch + 6}" width="${cw - 12}" height="${ch - 12}" fill="${fill}"/>`;
      }
    }
    out += `<rect x="0" y="${H * 0.5 - 4}" width="${W}" height="8" fill="${p.accent}"/>`;
    return out;
  },

  /** Repeating arcs, like a signal sweeping across the page. */
  wave: (p, r) => {
    let out = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;
    const n = 22;
    const amp = H * (0.16 + r() * 0.12);
    for (let i = 0; i < n; i++) {
      const y = H * 0.12 + (i * H * 0.78) / n;
      const phase = r() * 0.4;
      out += `<path d="M0 ${y} C ${W * 0.3} ${y - amp * (1 + phase)}, ${W * 0.7} ${y + amp * (1 + phase)}, ${W} ${y}" fill="none" stroke="${i === Math.floor(n / 2) ? p.accent : p.ink}" stroke-width="${i === Math.floor(n / 2) ? 14 : 3}" opacity="${i === Math.floor(n / 2) ? 1 : 0.75}"/>`;
    }
    return out;
  },

  /** A hard diagonal split with a floating counterform. */
  diagonal: (p, r) => `
    <rect width="${W}" height="${H}" fill="${p.bg}"/>
    <path d="M0 ${H * (0.28 + r() * 0.24)} L${W} ${H * (0.02 + r() * 0.18)} L${W} ${H} L0 ${H} Z" fill="${p.ink}"/>
    <circle cx="${W * (0.2 + r() * 0.45)}" cy="${H * (0.26 + r() * 0.16)}" r="${H * (0.14 + r() * 0.08)}" fill="${p.accent}"/>
    <rect x="${W * 0.06}" y="${H * 0.74}" width="${W * (0.22 + r() * 0.4)}" height="12" fill="${p.accent}"/>
    <rect x="${W * 0.06}" y="${H * 0.8}" width="${W * (0.14 + r() * 0.24)}" height="12" fill="${p.bg}" opacity="0.5"/>`,

  /** Abstracted newsprint columns — set type reduced to rules. */
  columns: (p, r) => {
    const n = 5;
    const gut = W * 0.035;
    const cw = (W - gut * (n + 1)) / n;
    let out = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;
    for (let i = 0; i < n; i++) {
      const x = gut + i * (cw + gut);
      let y = H * 0.14;
      const accentLine = Math.floor(r() * 9) + 2;
      let line = 0;
      while (y < H * 0.9) {
        const lw = cw * (0.55 + r() * 0.45);
        const isAccent = line === accentLine;
        out += `<rect x="${x}" y="${y}" width="${lw}" height="${isAccent ? 16 : 9}" fill="${isAccent ? p.accent : p.ink}" opacity="${isAccent ? 1 : 0.82}"/>`;
        y += isAccent ? 34 : 22;
        line++;
      }
    }
    out += `<rect x="${gut}" y="${H * 0.07}" width="${W - gut * 2}" height="7" fill="${p.ink}"/>`;
    return out;
  },

  /** A single aperture punched through a ruled ground. */
  aperture: (p, r) => {
    let rules = "";
    for (let i = 0; i < 44; i++) {
      rules += `<rect x="0" y="${i * (H / 44)}" width="${W}" height="${H / 110}" fill="${p.ink}" opacity="0.55"/>`;
    }
    const cx = W * (0.36 + r() * 0.28);
    return `<rect width="${W}" height="${H}" fill="${p.bg}"/>${rules}
      <circle cx="${cx}" cy="${H * 0.5}" r="${H * 0.36}" fill="${p.accent}"/>
      <circle cx="${cx}" cy="${H * 0.5}" r="${H * 0.19}" fill="${p.bg}"/>
      <rect x="${cx - 6}" y="0" width="12" height="${H}" fill="${p.bg}" opacity="0.9"/>`;
  },

  /** Bars rising like a chart, one picked out in red. */
  spike: (p, r) => {
    const n = 13;
    const gap = W * 0.012;
    const bw = (W - gap * (n + 1)) / n;
    const hot = Math.floor(r() * n);
    let out = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const h = H * (0.18 + Math.pow(t, 1.6) * 0.62 + r() * 0.12);
      out += `<rect x="${gap + i * (bw + gap)}" y="${H - h - H * 0.1}" width="${bw}" height="${h}" fill="${i === hot ? p.accent : p.ink}" opacity="${i === hot ? 1 : 0.88}"/>`;
    }
    out += `<rect x="0" y="${H * 0.9 - 5}" width="${W}" height="6" fill="${p.ink}"/>`;
    return out;
  },

  /** Nested frames closing on a solid core. */
  frames: (p, r) => {
    let out = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;
    const ox = W * (0.03 + r() * 0.04);
    for (let i = 0; i < 7; i++) {
      const inset = ox + i * (W * 0.04);
      out += `<rect x="${inset}" y="${inset * 0.68}" width="${W - inset * 2}" height="${H - inset * 1.36}" fill="none" stroke="${i === 2 ? p.accent : p.ink}" stroke-width="${i === 2 ? 18 : 3.5}"/>`;
    }
    out += `<rect x="${W * 0.36}" y="${H * 0.38}" width="${W * 0.28}" height="${H * 0.24}" fill="${p.ink}"/>`;
    return out;
  },
};

/* ── Comic strips ────────────────────────────────────────────────────────
   Inked panels: heavy black rules, flat red spot colour, figures suggested
   with simple geometry so the strip reads as drawn rather than generated. */

function figure(x, groundY, scale, p, r, tone) {
  const s = scale;
  const headR = 26 * s;
  const bodyH = 96 * s;
  const legH = 70 * s;
  const topY = groundY - legH - bodyH - headR * 2;
  const lean = (r() - 0.5) * 10 * s;
  return `
    <circle cx="${x + lean}" cy="${topY + headR}" r="${headR}" fill="${tone}"/>
    <path d="M${x - 30 * s} ${groundY - legH} L${x - 26 * s + lean} ${topY + headR * 2} L${x + 26 * s + lean} ${topY + headR * 2} L${x + 30 * s} ${groundY - legH} Z" fill="${tone}"/>
    <rect x="${x - 22 * s}" y="${groundY - legH}" width="${16 * s}" height="${legH}" fill="${tone}"/>
    <rect x="${x + 6 * s}" y="${groundY - legH}" width="${16 * s}" height="${legH}" fill="${tone}"/>`;
}

function bubble(x, y, w, h, p, tailDown = true) {
  const tail = tailDown
    ? `<path d="M${x + w * 0.24} ${y + h} l0 ${h * 0.34} l${w * 0.2} ${-h * 0.34} Z" fill="${p.bg}" stroke="${p.ink}" stroke-width="7"/>`
    : "";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h * 0.36}" fill="${p.bg}" stroke="${p.ink}" stroke-width="7"/>
    ${tail}
    <rect x="${x + w * 0.14}" y="${y + h * 0.3}" width="${w * 0.62}" height="${h * 0.12}" fill="${p.ink}" opacity="0.8"/>
    <rect x="${x + w * 0.14}" y="${y + h * 0.54}" width="${w * 0.42}" height="${h * 0.12}" fill="${p.ink}" opacity="0.8"/>`;
}

function panel(x, y, w, h, p, r, index) {
  const gy = y + h * 0.86;
  let inner = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${index % 3 === 1 ? p.soft : p.bg}"/>`;

  // Ground line and a spot-colour block for depth.
  if (r() > 0.35) {
    inner += `<rect x="${x}" y="${y + h * 0.5}" width="${w}" height="${h * 0.5}" fill="${p.accent}" opacity="${0.16 + r() * 0.16}"/>`;
  }
  inner += `<rect x="${x}" y="${gy}" width="${w}" height="5" fill="${p.ink}"/>`;

  // One to three figures, scaled to the panel.
  const count = 1 + Math.floor(r() * 3);
  const s = (h / 300) * (0.8 + r() * 0.3);
  for (let i = 0; i < count; i++) {
    const fx = x + w * (0.2 + (i * 0.62) / Math.max(1, count - 1 || 1) + r() * 0.08);
    inner += figure(fx, gy, s, p, r, i === 0 && r() > 0.5 ? p.accent : p.ink);
  }

  if (r() > 0.4) {
    inner += bubble(x + w * 0.08, y + h * 0.07, w * 0.5, h * 0.26, p);
  }

  return `<g clip-path="url(#clip${index})">${inner}</g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${p.ink}" stroke-width="9"/>`;
}

function comic(seed) {
  const r = rng(seed);
  const p = r() > 0.75 ? palettes.bone : palettes.paper;
  const single = /single|group-chat/.test(seed);
  const cols = single ? 1 : 3;
  const rows = single ? 1 : 2;
  const m = 46;
  const g = 22;
  const pw = (W - m * 2 - g * (cols - 1)) / cols;
  const ph = (H - m * 2 - g * (rows - 1)) / rows;

  let clips = "";
  let panels = "";
  let i = 0;
  for (let ry = 0; ry < rows; ry++) {
    for (let rx = 0; rx < cols; rx++) {
      const x = m + rx * (pw + g);
      const y = m + ry * (ph + g);
      clips += `<clipPath id="clip${i}"><rect x="${x}" y="${y}" width="${pw}" height="${ph}"/></clipPath>`;
      panels += panel(x, y, pw, ph, p, r, i);
      i++;
    }
  }
  return {
    defs: clips,
    body: `<rect width="${W}" height="${H}" fill="${p.bg}"/>
      <rect x="0" y="0" width="${W}" height="14" fill="${p.accent}"/>${panels}`,
  };
}

/* ── Illustrated plates (Bible readings) ─────────────────────────────── */

function plate(seed) {
  const r = rng(seed);
  const p = pick(r, [palettes.sand, palettes.bone, palettes.paper]);
  const horizon = H * (0.58 + r() * 0.1);
  let sky = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;

  // Banded sky.
  const bands = 7;
  for (let i = 0; i < bands; i++) {
    const bh = horizon / bands;
    sky += `<rect x="0" y="${i * bh}" width="${W}" height="${bh * 0.55}" fill="${p.ink}" opacity="${0.05 + i * 0.035}"/>`;
  }

  // Sun / disc.
  const sx = W * (0.24 + r() * 0.5);
  const sy = horizon - H * (0.16 + r() * 0.12);
  sky += `<circle cx="${sx}" cy="${sy}" r="${H * 0.15}" fill="${p.accent}"/>`;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r1 = H * 0.19;
    const r2 = H * (0.23 + (i % 2 ? 0.05 : 0));
    sky += `<line x1="${sx + Math.cos(a) * r1}" y1="${sy + Math.sin(a) * r1}" x2="${sx + Math.cos(a) * r2}" y2="${sy + Math.sin(a) * r2}" stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>`;
  }

  // Hills.
  let hills = "";
  for (let i = 3; i >= 1; i--) {
    const base = horizon + (3 - i) * H * 0.06;
    const peak = base - H * (0.08 + i * 0.05 + r() * 0.05);
    const cx = W * (0.12 + r() * 0.76);
    hills += `<path d="M${-W * 0.1} ${base + H * 0.4} L${-W * 0.1} ${base} Q ${cx * 0.5} ${peak} ${cx} ${base - H * 0.02} Q ${(cx + W) / 2} ${peak + H * 0.04} ${W * 1.1} ${base} L${W * 1.1} ${base + H * 0.4} Z" fill="${p.ink}" opacity="${0.28 + (3 - i) * 0.3}"/>`;
  }

  // Foreground: wheat or a path, depending on the seed.
  let fore = `<rect x="0" y="${H * 0.9}" width="${W}" height="${H * 0.1}" fill="${p.ink}"/>`;
  if (r() > 0.45) {
    for (let i = 0; i < 34; i++) {
      const x = W * (0.02 + (i / 34) * 0.96) + (r() - 0.5) * 20;
      const h = H * (0.1 + r() * 0.12);
      fore += `<line x1="${x}" y1="${H * 0.92}" x2="${x + (r() - 0.5) * 24}" y2="${H * 0.92 - h}" stroke="${p.ink}" stroke-width="5" stroke-linecap="round"/>`;
      fore += `<circle cx="${x + (r() - 0.5) * 24}" cy="${H * 0.92 - h}" r="9" fill="${p.accent}"/>`;
    }
  } else {
    fore += `<path d="M${W * 0.42} ${H} L${W * 0.48} ${horizon + H * 0.02} L${W * 0.54} ${horizon + H * 0.02} L${W * 0.68} ${H} Z" fill="${p.bg}" opacity="0.85"/>`;
  }

  return { defs: "", body: sky + hills + fore };
}

/* ── Assembly ────────────────────────────────────────────────────────── */

const editorialNames = Object.keys(editorial);
const paletteNames = Object.keys(palettes);

function editorialArt(seed) {
  const r = rng(seed);
  const comp = pick(r, editorialNames);
  const pal = palettes[pick(r, paletteNames)];
  return { defs: "", body: editorial[comp](pal, r) };
}

function svg(seed, kind) {
  const { defs, body } =
    kind === "comic" ? comic(seed) : kind === "plate" ? plate(seed) : editorialArt(seed);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs>
    ${defs}
    <!-- Paper tooth. Plain alpha compositing only: mix-blend-mode inside an SVG
         blends against a transparent backdrop when used in an <img>. -->
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
    </filter>
  </defs>
  <g>${body}</g>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.07"/>
</svg>`;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("usage: node scripts/generate-artwork.mjs <slug>[:kind] ...");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
for (const arg of args) {
  const [name, kind = "editorial"] = arg.split(":");
  writeFileSync(resolve(OUT, `${name}.svg`), svg(name, kind));
}
console.log(`Wrote ${args.length} artwork file(s) to public/images`);
