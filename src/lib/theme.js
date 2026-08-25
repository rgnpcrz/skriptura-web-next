// Single source of truth for theming. The palette itself lives in globals.css
// as CSS variables; this module only decides *which* theme is active, persists
// the choice, and drives the switch animation.

export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'
export const THEME_SYSTEM = 'system'

/** User-selectable preferences, in the order the toggle renders them. */
export const THEMES = [THEME_LIGHT, THEME_DARK, THEME_SYSTEM]

export const STORAGE_KEY = 'skriptura-theme'

/** Must match --canvas in globals.css — drives the mobile browser chrome. */
export const THEME_COLORS = {
  [THEME_LIGHT]: '#f8fafc',
  [THEME_DARK]: '#0b0d0f',
}

const DARK_QUERY = '(prefers-color-scheme: dark)'
const META_SELECTOR = 'meta[name="theme-color"]'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const TRANSITION_MS = 320

/** The element the reveal expands out of — the wordmark, marked in the header. */
const ORIGIN_SELECTOR = '[data-theme-origin]'

const isTheme = (value) => value === THEME_LIGHT || value === THEME_DARK

export function getSystemTheme() {
  return window.matchMedia(DARK_QUERY).matches ? THEME_DARK : THEME_LIGHT
}

/** Turn a preference (which may be `system`) into a concrete theme. */
export function resolveTheme(preference) {
  return isTheme(preference) ? preference : getSystemTheme()
}

export function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isTheme(stored) ? stored : THEME_SYSTEM
  } catch {
    // Private mode / blocked storage — fall back to following the system.
    return THEME_SYSTEM
  }
}

export function storeTheme(preference) {
  try {
    if (preference === THEME_SYSTEM) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Nothing to do — the theme still applies for this session.
  }
}

/**
 * Write the theme to the DOM. `data-theme` swaps the palette, `data-theme-pref`
 * lets CSS highlight the active toggle option before React has hydrated.
 */
export function applyTheme(preference) {
  const root = document.documentElement
  const resolved = resolveTheme(preference)

  root.dataset.theme = resolved
  root.dataset.themePref = preference

  const meta = document.querySelector(META_SELECTOR)
  if (meta) meta.setAttribute('content', THEME_COLORS[resolved])

  return resolved
}

/* ------------------------------------------------------------------------- *
 * Theme store
 *
 * The preference lives outside React: the pre-paint script has already written
 * it to the DOM by the time React runs, and it can change from the OS or from
 * another tab. `useSyncExternalStore` reads it without an effect, so there is
 * no cascading render on mount. It is held in memory as well as in
 * localStorage, so a blocked storage API still keeps the choice for the session.
 * ------------------------------------------------------------------------- */

const listeners = new Set()
let preference = null
let snapshot = null
let subscribed = false

/** Stable value for SSR and the hydration render — the resolved theme is unknowable there. */
const SERVER_SNAPSHOT = Object.freeze({ preference: THEME_SYSTEM, resolved: null })

function getPreference() {
  if (preference === null) preference = readStoredTheme()
  return preference
}

function computeSnapshot() {
  const current = getPreference()
  return Object.freeze({ preference: current, resolved: resolveTheme(current) })
}

/** Recompute the cached snapshot and wake every subscriber. */
function publish() {
  snapshot = computeSnapshot()
  listeners.forEach((listener) => listener())
}

function handleSystemChange() {
  if (getPreference() !== THEME_SYSTEM) return
  applyTheme(THEME_SYSTEM)
  publish()
}

/** Another tab changed the choice — mirror it here. */
function handleStorage(event) {
  if (event.key !== null && event.key !== STORAGE_KEY) return
  const next = readStoredTheme()
  if (next === getPreference()) return
  preference = next
  applyTheme(next)
  publish()
}

export function subscribeTheme(listener) {
  listeners.add(listener)
  if (!subscribed) {
    subscribed = true
    window.matchMedia(DARK_QUERY).addEventListener('change', handleSystemChange)
    window.addEventListener('storage', handleStorage)
  }
  return () => listeners.delete(listener)
}

export function getThemeSnapshot() {
  // Cached: useSyncExternalStore compares snapshots by identity.
  if (!snapshot) snapshot = computeSnapshot()
  return snapshot
}

export function getServerThemeSnapshot() {
  return SERVER_SNAPSHOT
}

/** Persist the choice, paint it, and notify React — all inside one commit. */
export function commitTheme(next) {
  preference = next
  storeTheme(next)
  applyTheme(next)
  publish()
}

export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

/**
 * Point the circular reveal at the wordmark.
 *
 * Only the centre comes from JavaScript; the radius is a fixed `150vmax` in the
 * stylesheet. A measured radius can come out short — the box the browser
 * animates is the snapshot containing block, which is not always what
 * `innerWidth`/`innerHeight` report — and the stylesheet is arranged so that
 * even a short wipe cannot leave a seam: the finished theme is painted
 * underneath, and it is the old one that gets masked away.
 */
function setRevealGeometry(root) {
  const w = window.innerWidth
  const h = window.innerHeight
  const anchor = document.querySelector(ORIGIN_SELECTOR)?.getBoundingClientRect()

  // Clamped: an origin outside the viewport would need more than 150vmax.
  const x = anchor?.width ? clamp(anchor.left + anchor.width / 2, 0, w) : w / 2
  const y = anchor?.height ? clamp(anchor.top + anchor.height / 2, 0, h) : 0

  root.style.setProperty('--theme-x', `${x}px`)
  root.style.setProperty('--theme-y', `${y}px`)
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

/**
 * Run `commit` (which must mutate the DOM synchronously) behind the nicest
 * transition the browser can afford:
 *   1. View Transitions — a GPU-composited circular wipe from the click point.
 *   2. A short, temporary color transition on everything.
 *   3. Nothing at all, when the visitor asked for reduced motion.
 * The fallback rule is attached only for the duration of the swap so it never
 * competes with hover transitions during normal browsing.
 */
export function runThemeTransition(commit) {
  const root = document.documentElement

  if (prefersReducedMotion()) return commit()

  if (typeof document.startViewTransition === 'function') {
    setRevealGeometry(root)
    document.startViewTransition(commit)
    return
  }

  root.dataset.themeAnimating = ''
  commit()
  window.setTimeout(() => {
    delete root.dataset.themeAnimating
  }, TRANSITION_MS)
}

const json = JSON.stringify

/**
 * Blocking snippet inlined ahead of the first paint, so the right palette is in
 * place before anything renders. Dependency-free and deliberately tiny. The
 * storage read carries its own try/catch: when localStorage is unavailable the
 * theme should still resolve from the OS rather than be skipped altogether.
 */
export const themeInitScript = [
  `(function(){var d=document.documentElement,p=${json(THEME_SYSTEM)};`,
  `try{var s=localStorage.getItem(${json(STORAGE_KEY)});`,
  `if(s===${json(THEME_LIGHT)}||s===${json(THEME_DARK)})p=s}catch(e){}`,
  `try{var t=p===${json(THEME_SYSTEM)}?(matchMedia(${json(DARK_QUERY)}).matches?${json(THEME_DARK)}:${json(THEME_LIGHT)}):p;`,
  `d.dataset.theme=t;d.dataset.themePref=p;`,
  `var m=document.querySelector(${json(META_SELECTOR)});`,
  `if(m)m.setAttribute("content",t===${json(THEME_DARK)}?${json(THEME_COLORS[THEME_DARK])}:${json(THEME_COLORS[THEME_LIGHT])})`,
  `}catch(e){}})();`,
].join('')
