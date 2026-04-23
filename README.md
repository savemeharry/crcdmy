# Creata Academy — landing

Продуктовый одностраничник для **Creata Academy** — платформы академий нового поколения. Подача в стиле Apple product reveal: большая типографика, кинематографические иллюстрации через `mix-blend-mode: screen`, минимум декора.

Важно по смыслу: **Creative Start — это отдельное мероприятие**, к продукту на этом лендинге отношения не имеет. Контент мероприятия (77 лекций, 11 модулей, конкретные лекторы, 5 творческих треков) **не упоминается**.

## Запуск

```bash
cd landing
python3 -m http.server 4321
# → http://localhost:4321
```

## Структура

```
landing/
├── index.html               # одностраничник, 11 секций
├── styles.css               # дизайн-токены + hero + общие стили
├── styles-features.css      # feature-блоки + pipeline + scale + faq + cta
├── script.js                # reveals, count-up, waveform, ticker
├── gen-images.mjs           # Gemini-генератор иллюстраций
├── assets/
│   ├── creata-logo.svg      # wordmark Creata Academy
│   ├── cs-icon.svg          # favicon (pyramid)
│   └── illustrations/       # 7 сгенерированных иллюстраций (чёрный фон, под blend-mode)
└── README.md
```

## Ключевые решения

### Палитра из логотипа

Два акцентных цвета, как в логотипе: **cyan `#4DE9FF`** + **mint `#42E8BE`**. Используются в парах — в градиентах, на `::before` маркерах, в акцентном тексте. Плюс **purple `#AF33E4`** (фирменный градиент) для pipeline-узлов.

### Иллюстрации через mix-blend-mode

Все иллюстрации в `assets/illustrations/` — на **абсолютно чёрном фоне `#000000`**. Накладываются через `mix-blend-mode: screen`, чтобы чёрный становился прозрачным, а светящиеся элементы попадали на любую подложку без порчи фонов.

7 иллюстраций:
- `hero.jpg` — флюидная смокинг-скульптура (cyan/purple/mint) — фон hero
- `manifesto.jpg` — вертикальный столб света — атмосфера под манифестом
- `voice.jpg` — ленты звука — в card feature 01
- `structure.jpg` — геометрический wireframe — в card feature 02
- `ascent.jpg` — восходящие искры — в card feature 04
- `network.jpg` — нейро-узлы — фон pipeline-секции
- `horizon.jpg` — восход света — в player-экране и final CTA

### Отказ от cliché

- **Нет эмодзи** — все иконки инлайновые SVG (Lucide-style).
- **Нет градиент-кружков и полосок-разделителей** — как устаревшего AI-аэстетик.
- **Нет упоминаний конкретных AI-моделей** — в pipeline секции говорим ЧТО делаем, не НА ЧЁМ.
- **IBM Plex Mono вместо JetBrains Mono** — моно-шрифт без dev-tool-флёра.

### Секции

1. **Nav** — floating pill с логотипом
2. **Hero** — big headline + иллюстрация справа (не центр, не перекрывает текст)
3. **Ticker** — generic фичи
4. **Manifesto** — одна фраза + атмосферная подложка
5. **Product** — mockup плеера, 6 слоёв одного урока
6. **Features 01–05** — Apple-style чередующиеся блоки:
   - 01 Голос (waveform bars)
   - 02 Инфографика (87% counter + структурная подложка)
   - 03 Практика (квиз с подсветкой)
   - 04 Мотивация (XP + streak + бейджи + ascent)
   - 05 Поток (5 вкладок с editable-таблицей)
7. **Pipeline** — 4 узла (бриф → сценарий → производство → запуск) с сетевой подложкой, цветной glow под каждым узлом
8. **Scale** — 6 целевых рынков с SVG-иконками
9. **FAQ** — 7 B2B-вопросов (white-label, языки, владение контентом, LMS)
10. **Final CTA** — «покажем за 30 минут, запустим за месяц» + горизонт-подложка
11. **Footer**

## Что подменить перед деплоем

- `mailto:hello@creata-academy.com` в final CTA — подставить реальный email
- `og:image` для соцсетей (сейчас не задан)
- Google Analytics / Plausible
- Итоговое имя продукта — если «Creata Academy» не финал, глобальный replace в `index.html` и ребрендинг `assets/creata-logo.svg`

## Регенерация иллюстраций

Если нужно пересобрать картинку или все:

```bash
node gen-images.mjs           # все 7
node gen-images.mjs hero      # только hero
node gen-images.mjs voice structure  # две выборочно
```

Ключ Gemini читается из `../coursebuilder/.env.local` → `GEMINI_API_KEY`.

Промпты правятся прямо в `gen-images.mjs` (объект `PROMPTS`). Правило одно: **пишите в промпте «pitch-black absolute #000000 background»**, иначе `mix-blend-mode: screen` не сработает чисто.

## Стек и поход

- Чистый HTML/CSS/JS, без сборки, под любой статический хостинг (Vercel/Netlify/Cloudflare/S3).
- **Fonts:** Inter + Onest + Instrument Serif (italic) + IBM Plex Mono.
- **Анимации:** IntersectionObserver для reveal'ов и counters, CSS keyframes для waveform и hero-drift.
- **A11y:** семантика, `aria-label`, `aria-hidden` на декоре, `details/summary` для FAQ.
