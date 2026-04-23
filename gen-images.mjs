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

// Vibrant but balanced brand palette — alive, not dead
const PALETTE =
  'vibrant purple #A84FDB as primary body color, electric cyan #4DE9FF as glowing accent, mint green #42E8BE for secondary accents, white only for specular highlights (≤10% area)';

const ICONS = {
  // ----- Scale section -------------------------------------------------
  'icon-corp': {
    subject:
      `a 3D modern office tower: several layered stories, clean geometric form, vibrant purple (#A84FDB) glossy body with cyan (#4DE9FF) window lights glowing across floors, a soft mint (#42E8BE) accent at the top spire. Crisp studio rim lighting.`,
  },
  'icon-uni': {
    subject:
      `a 3D miniature classical academic building: portico with four slim columns, a triangular pediment, steps leading up. Vibrant purple (#A84FDB) matte body with cyan (#4DE9FF) light glow visible through the gaps between columns and a subtle mint (#42E8BE) highlight on the pediment edge. Clean studio lighting.`,
  },
  'icon-school': {
    subject:
      `a 3D graduation mortarboard cap, slightly tilted showing depth, with a hanging tassel. Vibrant purple (#A84FDB) glossy cap surface with cyan (#4DE9FF) button at center and a bright mint (#42E8BE) tassel. Studio lighting creating clean specular highlights.`,
  },
  'icon-rocket': {
    subject:
      `a 3D sleek vertical rocket ship, smooth rounded body with fins. Vibrant purple (#A84FDB) main body, cyan (#4DE9FF) nose cone, mint (#42E8BE) fins, and a short cyan (#4DE9FF) glowing flame beneath. Crisp studio lighting.`,
  },
  'icon-bootcamp': {
    subject:
      `a 3D cluster of three rounded capsule-shaped figures standing together, no faces no features, simplified human forms. First figure vibrant purple (#A84FDB), second figure cyan (#4DE9FF), third figure mint (#42E8BE). Premium glossy material, studio lighting.`,
  },
  'icon-globe': {
    subject:
      `a 3D translucent globe sphere with latitude and longitude wireframe lines. Vibrant purple (#A84FDB) sphere body with cyan (#4DE9FF) meridian and equator lines glowing, mint (#42E8BE) pole caps. Premium glossy finish.`,
  },

  // ----- Pipeline stages -----------------------------------------------
  'pipe-brief': {
    subject:
      `a 3D clipboard holding a single sheet of paper with a clip on top. Vibrant purple (#A84FDB) clipboard body, cyan (#4DE9FF) paper, mint (#42E8BE) metal clip. Clean glossy studio shot.`,
  },
  'pipe-script': {
    subject:
      `a 3D fountain pen floating diagonally above a single sheet of paper with a short ink stroke trailing from the nib. Vibrant purple (#A84FDB) pen body, cyan (#4DE9FF) nib and ink trail, white paper. Premium studio rendering.`,
  },
  'pipe-ai': {
    subject:
      `a 3D softly rounded translucent cube floating, with a glowing sphere suspended inside. Vibrant purple (#A84FDB) cube faces with cyan (#4DE9FF) inner sphere glow and mint (#42E8BE) edge highlights. Clean product-icon aesthetic.`,
  },
  'pipe-launch': {
    subject:
      `a 3D rocket ship taking off, tilted slightly upward with a short flame. Vibrant purple (#A84FDB) body, mint (#42E8BE) fins, cyan (#4DE9FF) engine flame with a small light trail behind. Studio lighting.`,
  },
};

const iconStyleSuffix =
  ` Isolated 3D object centered in frame, floating with no ground, very soft diffused lighting, ` +
  `smooth matte plastic material, Apple-style product-icon minimalism — clean, simple, airy. Low-saturation pastel rendering. ` +
  `ABSOLUTELY NO outline, NO border, NO frame, NO background objects, NO reflections on a surface. ` +
  `CRITICAL: pure solid absolute pitch-black #000000 background in every pixel outside the subject. No gradient, no haze, no ambient glow filling the background. Subject floats on ink-black void. ` +
  `Palette: strictly ${PALETTE}. Subject should read as LIGHT and AIRY, not saturated, not electric. No gold, amber, orange, red. Avoid dark purples — stick to pale pastels. ` +
  `No text, no logos, no UI. Square 1:1 composition with subject taking ~50% of frame.`;

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
