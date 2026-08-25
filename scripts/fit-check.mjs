/**
 * Text-fit check.
 *
 * Every headline on this site is set in Space Mono, and a monospace face makes
 * rendered width arithmetic: advance is a fixed fraction of the font size, so
 * the width of a string is (characters x (advance + letter-spacing) x size).
 * That means overflow can be checked without a browser — model the box each
 * string lands in at a given viewport, compare, and flag anything that does not
 * fit. It catches breakpoint cliffs, where a `sm:` prefix shrinks a box and
 * enlarges its text at the same width.
 *
 * It does NOT replace looking at the page: it knows nothing about line height,
 * real font fallback, or anything that is not monospace. Treat a pass as "the
 * arithmetic is sound", not "it looks right".
 *
 * Run: npm run check:fit
 */
import { readFileSync } from 'node:fs'

/** Space Mono advance width, in em. */
const ADVANCE = 0.6

/** Tailwind letter-spacing utilities, in em. */
const TRACKING = { normal: 0, tight: -0.025, wide: 0.025, wider: 0.05, widest: 0.1 }

/** Headroom required on top of the computed width, for metric drift. */
const SAFETY = 0.03

const VIEWPORTS = [320, 360, 375, 390, 414, 480, 540, 600, 639, 640, 700, 768, 820, 900, 1000, 1023, 1024, 1100, 1152, 1280, 1440, 1920]

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const dict = (lang) => JSON.parse(read(`src/i18n/${lang}.json`))
const EN = dict('en')
const SQ = dict('sq')

const textWidth = (text, size, tracking = 'normal') =>
  text.length * (ADVANCE + TRACKING[tracking]) * size

/* -- layout model -------------------------------------------------------- */

/** <main class="max-w-6xl w-full mx-auto px-4 sm:px-6"> — border-box. */
const mainInner = (vw) => Math.min(vw, 1152) - (vw < 640 ? 32 : 48)

/** One cell of a grid inside <main>, minus the Card's border-2 and p-4 sm:p-6. */
const gridCard = (vw, cols, gap) => {
  const n = typeof cols === 'function' ? cols(vw) : cols
  const g = typeof gap === 'function' ? gap(vw) : gap
  const outer = (mainInner(vw) - g * (n - 1)) / n
  return outer - 2 * (vw < 640 ? 16 : 24) - 4
}

/* -- cases --------------------------------------------------------------- */

/*
 * The model below mirrors HomeClient's stat grid. `sync` asserts the component
 * still carries the classes it assumes, so the two cannot drift apart silently:
 * change the component and this fails until the model is updated to match.
 */
const HOME = read('src/components/pages/HomeClient.jsx')
const sync = []
const expectClass = (snippet) => {
  if (!HOME.includes(snippet)) sync.push(snippet)
}

expectClass('grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4')
expectClass("stat.small ? 'text-lg sm:text-3xl' : 'text-3xl sm:text-4xl'")
expectClass('font-mono text-xs uppercase tracking-widest text-on-accent/70')

const statCols = (vw) => (vw < 1024 ? 2 : 4)
const statGap = (vw) => (vw < 640 ? 12 : 16)
const statCard = (vw) => gridCard(vw, statCols, statGap)

// text-lg sm:text-3xl / text-3xl sm:text-4xl
const statValueSize = (vw, small) =>
  small ? (vw < 640 ? 18 : 30) : vw < 640 ? 30 : 36

const cases = [
  ...['2023', '7+', '2'].map((value) => ({
    name: `stat value "${value}"`,
    box: statCard,
    text: value,
    size: (vw) => statValueSize(vw, false),
  })),
  {
    name: 'stat value "Prishtinë"',
    box: statCard,
    text: EN.home.statCityValue,
    size: (vw) => statValueSize(vw, true),
  },
  ...[
    ['en', EN.home],
    ['sq', SQ.home],
  ].flatMap(([lang, home]) =>
    [home.statFounded, home.statClients, home.statOwners, home.statCity].map((label) => ({
      name: `stat label ${lang} "${label}"`,
      box: statCard,
      text: label,
      size: () => 12,
      tracking: 'widest',
    }))
  ),
]

/*
 * The header is a single flex row that has to hold the wordmark, the nav and
 * the preferences trigger at once. Albanian nav labels are about 30% longer
 * than English, so this is where a row that fits in one language quietly stops
 * fitting in the other.
 */
const HEADER = read('src/components/layout/Header.jsx')
const expectHeader = (snippet) => {
  if (!HEADER.includes(snippet)) sync.push(snippet)
}

expectHeader('font-mono font-bold text-lg sm:text-xl tracking-widest uppercase')
expectHeader('hidden lg:flex items-center gap-4 xl:gap-6')
expectHeader('font-mono font-bold text-sm uppercase tracking-wide px-1 py-0.5 border-b-2')

const NAV_VISIBLE_FROM = 1024 // hidden lg:flex

/** Six links: text-sm tracking-wide, px-1 each, gap-4 then xl:gap-6. */
const navWidth = (vw, labels) => {
  const links = labels.reduce((sum, l) => sum + textWidth(l, 14, 'wide') + 8, 0)
  return links + (vw >= 1280 ? 24 : 16) * (labels.length - 1)
}

/** border-2, px-2, locale code, theme icon, chevron, and the gaps between. */
const PREFS_TRIGGER = 4 + 16 + textWidth('EN', 12, 'wide') + 6 + 14 + 6 + 12
const HAMBURGER = 4 + 12 + 20
const GAP_2 = 8

const headerRow = (vw, labels) => {
  const wordmark = textWidth('SKRIPTURA', vw < 640 ? 18 : 20, 'widest')
  const nav = vw >= NAV_VISIBLE_FROM ? navWidth(vw, labels) : 0
  const burger = vw < NAV_VISIBLE_FROM ? GAP_2 + HAMBURGER : 0
  return wordmark + nav + PREFS_TRIGGER + burger
}

for (const [lang, nav] of [['en', EN.nav], ['sq', SQ.nav]]) {
  const labels = [nav.home, nav.about, nav.services, nav.clients, nav.projects, nav.contact]
  cases.push({
    name: `header row ${lang} (${labels.join(', ')})`,
    box: mainInner,
    // Already a measured total rather than a string, so bypass textWidth.
    width: (vw) => headerRow(vw, labels),
  })
}

/*
 * The hero wordmark is the largest text on the site and sits beside a
 * fixed-width terminal panel once the card goes horizontal, so its column is
 * narrower than the card from lg up.
 */
expectClass('text-[clamp(1.75rem,9vw,4.5rem)] leading-none tracking-widest')
expectClass('border-2 border-ink p-4 bg-terminal text-accent font-mono text-xs lg:min-w-52')

const TERMINAL_W = 208 // lg:min-w-52
const HERO_GAP = 24 // gap-6

// Card base p-4 sm:p-6, overridden to p-6 sm:p-10 by the hero's own className.
const heroCard = (vw) => mainInner(vw) - 2 * (vw < 640 ? 24 : 40) - 4
const heroColumn = (vw) => (vw >= 1024 ? heroCard(vw) - TERMINAL_W - HERO_GAP : heroCard(vw))

cases.push({
  name: 'hero wordmark (fluid)',
  box: heroColumn,
  text: 'SKRIPTURA',
  // clamp(1.75rem, 9vw, 4.5rem)
  size: (vw) => Math.max(28, Math.min(0.09 * vw, 72)),
  tracking: 'widest',
})

/*
 * Detail-page titles are `// NAME` in caps. They wrap at spaces, so only the
 * longest unbreakable word can overflow — and with overflow-wrap: break-word
 * globally, one that does not fit is what breaks mid-word.
 */
const names = ['clients', 'projects', 'services'].flatMap((f) =>
  [...read(`src/data/${f}.js`).matchAll(/name: '([^']+)'/g)].map((m) => m[1])
)
const longestWord = names
  .flatMap((n) => n.toUpperCase().split(/\s+/))
  .reduce((a, b) => (b.length > a.length ? b : a))

cases.push({
  name: `longest heading word "${longestWord}"`,
  // SectionHeader is min-w-0 in a row beside shrink-0 badges; assume two.
  box: (vw) => mainInner(vw) - (vw >= 640 ? 2 * 48 + 8 : 0),
  text: longestWord,
  size: (vw) => (vw < 640 ? 20 : 24), // text-xl sm:text-2xl
  tracking: 'tight',
})

/* -- run ----------------------------------------------------------------- */

let failures = 0
for (const c of cases) {
  const bad = []
  for (const vw of VIEWPORTS) {
    const box = c.box(vw)
    const raw = c.width ? c.width(vw) : textWidth(c.text, c.size(vw), c.tracking)
    const width = raw * (1 + SAFETY)
    if (width > box) bad.push({ vw, need: Math.round(width), have: Math.round(box) })
  }
  if (!bad.length) {
    console.log(`  ok    ${c.name}`)
    continue
  }
  failures++
  const first = bad[0]
  const last = bad[bad.length - 1]
  const range = bad.length === 1 ? `${first.vw}px` : `${first.vw}px-${last.vw}px`
  console.log(`  FAIL  ${c.name}`)
  console.log(`        overflows at ${range} (${bad.length}/${VIEWPORTS.length} widths)`)
  console.log(`        worst: ${first.vw}px needs ${first.need}px in a ${first.have}px box`)
}

for (const snippet of sync) {
  failures++
  console.log(`  FAIL  model no longer matches the component, missing:
        ${snippet}`)
}

console.log(failures ? `
${failures} problem(s)` : `
all ${cases.length} cases fit`)
process.exit(failures ? 1 : 0)
