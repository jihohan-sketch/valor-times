/**
 * Generates the editorial placeholder artwork in /public/images.
 * Every article in src/data/articles.ts points at one of these files, so
 * replacing a placeholder with a real photograph is a one-line data edit.
 *
 *   node scripts/generate-artwork.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
const W = 1600;
const H = 1067;

/** Strictly on-brand: warm paper, near-black ink, one red. No stray hues. */
const palettes = {
  bone: { bg: "#FBF9F6", ink: "#101014", accent: "#C8102E", soft: "#E7E1D8" },
  newsprint: { bg: "#F1ECE4", ink: "#101014", accent: "#C8102E", soft: "#DED6C9" },
  warm: { bg: "#E7DED2", ink: "#16130F", accent: "#B81228", soft: "#D3C7B6" },
  ink: { bg: "#101014", ink: "#FBF9F6", accent: "#E01235", soft: "#26262E" },
  charcoal: { bg: "#22222A", ink: "#F4F1EC", accent: "#E01235", soft: "#33333D" },
  scarlet: { bg: "#C8102E", ink: "#FFFFFF", accent: "#101014", soft: "#A80D26" },
};

/** Deterministic pseudo-random so artwork never changes between runs. */
function rng(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const compositions = {
  // Bold diagonal split with a floating disc.
  split: (p, r) => `
    <rect width="${W}" height="${H}" fill="${p.bg}"/>
    <path d="M0 ${H * (0.35 + r() * 0.2)} L${W} ${H * (0.05 + r() * 0.2)} L${W} ${H} L0 ${H} Z" fill="${p.ink}"/>
    <circle cx="${W * (0.22 + r() * 0.5)}" cy="${H * (0.3 + r() * 0.2)}" r="${H * (0.16 + r() * 0.1)}" fill="${p.accent}"/>
    <rect x="${W * 0.06}" y="${H * 0.72}" width="${W * (0.2 + r() * 0.35)}" height="10" fill="${p.accent}"/>`,

  // Concentric arcs radiating from a corner.
  arcs: (p, r) => {
    const cx = r() > 0.5 ? W * 0.12 : W * 0.88;
    let out = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;
    for (let i = 9; i > 0; i--) {
      const rad = (H * 1.05 * i) / 9;
      out += `<circle cx="${cx}" cy="${H * 0.9}" r="${rad}" fill="none" stroke="${i % 3 === 0 ? p.accent : p.ink}" stroke-width="${i % 3 === 0 ? 14 : 3}" opacity="${0.25 + i * 0.07}"/>`;
    }
    out += `<rect x="0" y="${H * 0.88}" width="${W}" height="${H * 0.12}" fill="${p.ink}"/>`;
    return out;
  },

  // Halftone dot field under a solid block.
  halftone: (p, r) => {
    let dots = "";
    const cols = 26;
    const rows = 17;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const rad = 3 + (y / rows) * 20 * (0.6 + r() * 0.8);
        dots += `<circle cx="${(x + 0.5) * (W / cols)}" cy="${(y + 0.5) * (H / rows)}" r="${rad.toFixed(1)}" fill="${p.ink}" opacity="0.8"/>`;
      }
    }
    return `<rect width="${W}" height="${H}" fill="${p.bg}"/>${dots}
      <rect x="${W * 0.58}" y="0" width="${W * 0.42}" height="${H}" fill="${p.accent}"/>
      <rect x="${W * 0.58}" y="${H * 0.62}" width="${W * 0.42}" height="${H * 0.38}" fill="${p.ink}"/>`;
  },

  // Vertical column rules — a nod to newsprint grids.
  columns: (p, r) => {
    let cols = "";
    const n = 12;
    for (let i = 0; i < n; i++) {
      const h = H * (0.25 + r() * 0.7);
      const fill = i % 4 === 1 ? p.accent : i % 3 === 0 ? p.ink : p.soft;
      cols += `<rect x="${(i + 0.15) * (W / n)}" y="${H - h}" width="${(W / n) * 0.7}" height="${h}" fill="${fill}"/>`;
    }
    return `<rect width="${W}" height="${H}" fill="${p.bg}"/>${cols}
      <rect x="0" y="${H * 0.18}" width="${W}" height="6" fill="${p.ink}"/>`;
  },

  // Nested frames with an off-centre aperture.
  frames: (p, r) => {
    let out = `<rect width="${W}" height="${H}" fill="${p.bg}"/>`;
    const ox = W * (0.04 + r() * 0.06);
    for (let i = 0; i < 6; i++) {
      const inset = ox + i * (W * 0.045);
      out += `<rect x="${inset}" y="${inset * 0.7}" width="${W - inset * 2}" height="${H - inset * 1.4}" fill="none" stroke="${i === 2 ? p.accent : p.ink}" stroke-width="${i === 2 ? 16 : 4}"/>`;
    }
    out += `<rect x="${W * 0.34}" y="${H * 0.36}" width="${W * 0.32}" height="${H * 0.28}" fill="${p.ink}"/>`;
    return out;
  },

  // Overlapping translucent planes.
  planes: (p, r) => `
    <rect width="${W}" height="${H}" fill="${p.bg}"/>
    <rect x="${W * 0.05}" y="${H * 0.1}" width="${W * 0.5}" height="${H * 0.62}" fill="${p.ink}"/>
    <rect x="${W * (0.3 + r() * 0.1)}" y="${H * 0.28}" width="${W * 0.45}" height="${H * 0.6}" fill="${p.accent}"/>
    <rect x="${W * 0.62}" y="${H * 0.06}" width="${W * 0.32}" height="${H * 0.44}" fill="${p.soft}"/>
    <circle cx="${W * 0.79}" cy="${H * 0.74}" r="${H * 0.14}" fill="none" stroke="${p.ink}" stroke-width="12"/>`,

  // A single large aperture over a striped ground.
  aperture: (p, r) => {
    let stripes = "";
    for (let i = 0; i < 40; i++) {
      stripes += `<rect x="0" y="${i * (H / 40)}" width="${W}" height="${H / 80}" fill="${p.ink}" opacity="0.5"/>`;
    }
    return `<rect width="${W}" height="${H}" fill="${p.bg}"/>${stripes}
      <circle cx="${W * (0.4 + r() * 0.2)}" cy="${H * 0.5}" r="${H * 0.34}" fill="${p.accent}"/>
      <circle cx="${W * (0.4 + r() * 0.2)}" cy="${H * 0.5}" r="${H * 0.2}" fill="${p.bg}"/>`;
  },
};

const compositionNames = Object.keys(compositions);
const paletteNames = Object.keys(palettes);

function artwork(name) {
  const r = rng(name);
  const comp = compositionNames[Math.floor(r() * compositionNames.length)];
  const pal = palettes[paletteNames[Math.floor(r() * paletteNames.length)]];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs>
    <!-- Paper tooth. Plain alpha compositing only: mix-blend-mode inside an
         SVG blends against a transparent backdrop when the file is used in an
         <img>, which crushes the colours. -->
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
    </filter>
  </defs>
  <g>${compositions[comp](pal, r)}</g>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.085"/>
</svg>`;
}

const names = process.argv.slice(2);
if (names.length === 0) {
  console.error("usage: node scripts/generate-artwork.mjs <slug> [<slug> ...]");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
for (const name of names) {
  writeFileSync(resolve(OUT, `${name}.svg`), artwork(name));
}
console.log(`Wrote ${names.length} artwork file(s) to public/images`);
