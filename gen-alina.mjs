import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'assets', 'photos');
mkdirSync(OUT, { recursive: true });

const envText = await readFile(join(__dirname, '..', 'coursebuilder', '.env.local'), 'utf8');
const KEY = envText.match(/GEMINI_API_KEY=(.+)/)[1].trim();

const prompt =
  `Photorealistic headshot portrait of a woman around 28-30 years old with straight shoulder-length dark hair, calm thoughtful expression, slight side gaze, no smile, soft natural studio lighting. ` +
  `Professional minimalist look, modern tech-industry vibe, warm natural skin tone. ` +
  `Shallow depth of field, background is soft dark blur with a subtle deep purple tint (around #1a0f2a). ` +
  `Editorial publication photography quality, not AI-looking, not stock-looking. ` +
  `Square 1:1 composition, shoulders-up framing, subject centered with a touch of negative space above.`;

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${KEY}`;
const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: { aspectRatio: '1:1', imageSize: '1K' },
    },
  }),
});
if (!res.ok) {
  console.error('HTTP ' + res.status + ': ' + (await res.text()).slice(0, 400));
  process.exit(1);
}
const json = await res.json();
const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
if (!part) { console.error('no image in response'); process.exit(1); }
await writeFile(join(OUT, 'alina.jpg'), Buffer.from(part.inlineData.data, 'base64'));
console.log('ok');
