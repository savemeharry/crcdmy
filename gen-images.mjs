/**
 * Gemini Nano Banana 2 — 3D brand-palette icons on pure black.
 * Palette: purple #AF33E4 → indigo #200DAF → cyan #4DE9FF + mint #42E8BE accents.
 * Use via mix-blend-mode: screen (black background disappears cleanly).
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICON_OUT = join(__dirname, 'assets', 'icons-3d');
mkdirSync(ICON_OUT, { recursive: true });

const envText = await readFile(
  join(__dirname, '..', 'coursebuilder', '.env.local'),
  'utf8',
);
const KEY = envText.match(/GEMINI_API_KEY=(.+)/)[1].trim();

// Natural muted materials with a single cyan rim-light accent
// Aesthetic: Apple / Linear / Figma Config 2024 3D icons
const PALETTE =
  'natural desaturated matte colors — soft off-white, muted cream, warm grey, charcoal, with a SINGLE subtle cyan (#4DE9FF) rim light from the right catching one edge of the subject';

const ICONS = {
  // ----- Scale section -------------------------------------------------
  'icon-corp': {
    subject:
      `a 3D miniature modern office tower, clean simple geometric form with subtle horizontal floor lines. Matte warm off-white (#F0EEE8) main body, slightly darker warm grey (#C8C4BC) shadow side. A single soft cyan (#4DE9FF) rim light catches the right edge only.`,
  },
  'icon-uni': {
    subject:
      `a 3D miniature classical academic building: four slim columns and a simple triangular pediment with small steps. Matte ivory marble (#EDEAE1) surface, warm cream (#D8D3C4) shadow side. A single soft cyan (#4DE9FF) rim light grazes the right column edge.`,
  },
  'icon-school': {
    subject:
      `a 3D graduation mortarboard cap gently tilted to show depth, with a small hanging tassel. Matte deep navy (#1F2334) cap surface, warm off-white (#EEE9DC) tassel. A single soft cyan (#4DE9FF) rim light catches the right edge of the mortarboard.`,
  },
  'icon-rocket': {
    subject:
      `a 3D sleek miniature rocket with a smooth rounded body and compact fins, no portholes. Matte off-white (#EFECE3) body, warm muted terracotta (#B8695A) nose cone and small fins. A single soft cyan (#4DE9FF) rim light on the right side.`,
  },
  'icon-bootcamp': {
    subject:
      `a 3D cluster of three rounded human capsule figures standing close together, no faces. All three in matte natural warm grey (#8E8A84), identical material, simple capsule forms. A single soft cyan (#4DE9FF) rim light edges the right-most figure.`,
  },
  'icon-globe': {
    subject:
      `a 3D minimalist sphere with clean latitude and longitude wireframe. Matte dark charcoal (#2A2C35) sphere body with warm off-white (#EAE8E0) wireframe lines of uniform thin weight. A single subtle cyan (#4DE9FF) rim light catches the right hemisphere curve.`,
  },

  // ----- Pipeline stages -----------------------------------------------
  'pipe-brief': {
    subject:
      `a 3D clipboard with a single paper sheet and metal clip, rounded corners. Matte warm cream paper (#F2EEE2), ash-brown (#6B5A4B) clipboard backing, dark charcoal (#2E2E33) clip. A single soft cyan (#4DE9FF) rim light on the right edge.`,
  },
  'pipe-script': {
    subject:
      `a 3D fountain pen floating diagonally above a single piece of paper with a short subtle ink stroke. Matte deep charcoal (#2A2C35) pen body with a small polished silver (#C8C6C2) nib, warm off-white (#F0ECE2) paper. A single soft cyan (#4DE9FF) rim light on the right side of the pen.`,
  },
  'pipe-ai': {
    subject:
      `a 3D softly rounded translucent frosted cube floating, with a very subtle warm interior light. Matte light warm grey (#D8D6D2) faces, minimalist, almost architectural. A single soft cyan (#4DE9FF) rim light on the right edge.`,
  },
  'pipe-launch': {
    subject:
      `a 3D miniature rocket lifting off with a tiny exhaust cloud. Matte warm off-white (#F0EDE6) body and fins, very subtle warm grey (#B8B4AB) shadow side. A single soft cyan (#4DE9FF) rim light on the right edge of the body.`,
  },

  // ----- Achievement badges (F04 motivation conveyor) ------------------
  // Same Linear/Apple aesthetic — concrete-white base + ONE distinct accent per badge
  'badge-star': {
    subject:
      `a 3D five-pointed star medal shape, slightly tilted showing depth, floating. Base material: matte warm concrete-white (#EDECE6). The center circle / inner dot of the star is a vivid electric purple (#AF33E4). Clean minimalist form, no glossy highlights, soft diffused lighting.`,
  },
  'badge-bolt': {
    subject:
      `a 3D stylized lightning bolt symbol, rounded edges, slightly tilted. Base material: matte warm concrete-white (#EDECE6). The inside core groove of the bolt glows with a vivid cyan (#4DE9FF) color. Clean minimalist form, no glossy highlights, soft diffused lighting.`,
  },
  'badge-target': {
    subject:
      `a 3D concentric target / bullseye puck with three rings, slightly tilted. Outer rings are matte warm concrete-white (#EDECE6). The central bullseye is a vivid magenta-pink (#F472B6). Clean minimalist form, no glossy highlights, soft diffused lighting.`,
  },
  'badge-trophy': {
    subject:
      `a 3D small trophy cup on a small base, side handles, slightly tilted. Base material: matte warm concrete-white (#EDECE6). The inside of the cup and the handle accents are warm yellow-gold (#FFD95A). Clean minimalist form, no glossy highlights, soft diffused lighting.`,
  },
  'badge-flame': {
    subject:
      `a 3D stylized flame shape with rounded silhouette. Outer shell is matte warm concrete-white (#EDECE6). The inner glowing core is a vivid coral-orange (#FF8A65). Clean minimalist form, no glossy highlights, soft diffused lighting.`,
  },
  'badge-crown': {
    subject:
      `a 3D minimalist three-pointed crown with rounded arches. Base material: matte warm concrete-white (#EDECE6). A single gemstone at the center arch is vivid mint-green (#42E8BE). Clean minimalist form, no glossy highlights, soft diffused lighting.`,
  },
};

const iconStyleSuffix =
  ` Isolated 3D object centered in frame, floating with no ground. Soft diffused studio lighting from the upper-left. ` +
  `Matte non-reflective surface — NO shiny cartoon specular highlights, NO bubble reflections, NO gloss. ` +
  `Apple / Linear / Figma Config 2024 3D-icon aesthetic: clean, understated, editorial. ` +
  `ABSOLUTELY NO outline, NO border, NO frame, NO background objects, NO reflections on a surface, NO ground shadow. ` +
  `CRITICAL: pure solid absolute pitch-black #000000 background in every pixel outside the subject. No gradient, no haze, no atmospheric glow, no ambient light filling the backdrop. Subject floats on ink-black void. ` +
  `Material: ${PALETTE}. Colors should be natural, desaturated, muted — NOT vibrant, NOT saturated, NOT neon. The only accent allowed beyond the base palette is the subtle cyan (#4DE9FF) rim light on the right edge. ` +
  `No text, no logos, no UI. Square 1:1 composition with subject taking ~55% of frame.`;

async function generateImage(name, spec) {
  const prompt = spec.subject + '.' + iconStyleSuffix;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: { aspectRatio: '1:1', imageSize: '1K' },
    },
  };
  const t0 = Date.now();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`[${name}] HTTP ${res.status}: ${t.slice(0, 300)}`);
  }
  const json = await res.json();
  const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error(`[${name}] no inlineData in response`);
  const buf = Buffer.from(part.inlineData.data, 'base64');
  await writeFile(join(ICON_OUT, `${name}.jpg`), buf);
  console.log(`ok  ${name.padEnd(16)} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

const wanted = process.argv.slice(2);
const keys = wanted.length ? wanted : Object.keys(ICONS);

const results = await Promise.allSettled(
  keys.map((name) => generateImage(name, ICONS[name])),
);
const fails = results.filter((r) => r.status === 'rejected');
if (fails.length) {
  console.error('\nFAILURES:');
  for (const f of fails) console.error('  ' + f.reason.message);
  process.exit(1);
}
