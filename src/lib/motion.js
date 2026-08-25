// Scroll-in reveals and page transitions.
//
// The hidden state is gated behind `data-motion="on"` on <html>, set by the
// pre-paint script only when the browser can actually run the reveal and the
// visitor has not asked for reduced motion. Without that attribute every
// element renders plainly — which is also the no-JavaScript fallback.

export const REVEAL_SELECTOR = '[data-reveal]:not([data-revealed])'

/** Cap the stagger so a long page never waits on a queue of delays. */
const MAX_STAGGER_STEPS = 4
const STAGGER_MS = 70

/**
 * Reveal every marked block inside `main` as it scrolls into view. One observer
 * for the page, each target unobserved once shown, and no scroll listener — the
 * only per-frame work is the compositor animating opacity and transform.
 */
export function observeReveals() {
  const root = document.documentElement
  if (root.dataset.motion !== 'on') return undefined

  // Tells the pre-paint failsafe that the reveal is live and it can stand down.
  root.dataset.revealReady = ''

  const targets = document.querySelectorAll(`main ${REVEAL_SELECTOR}`)
  if (!targets.length) return undefined

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.dataset.revealed = ''
        observer.unobserve(entry.target)
      }
    },
    // Fire a little before the block reaches the fold, so it has finished
    // arriving by the time it is properly in view.
    { rootMargin: '0px 0px -8% 0px', threshold: 0.04 }
  )

  targets.forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${Math.min(i, MAX_STAGGER_STEPS) * STAGGER_MS}ms`)
    observer.observe(el)
  })

  return () => observer.disconnect()
}

/**
 * Runs with the theme script, before the first paint. Turning motion on here
 * rather than from React is what keeps the marked blocks from flashing visible
 * and then hiding themselves once hydration lands.
 *
 * The `load` failsafe covers the case where the bundle never boots: 1.2s after
 * load, if nothing has claimed the reveal, the hidden state is dropped so the
 * server-rendered content is readable rather than stuck at opacity 0.
 */
export const motionInitScript = [
  `(function(){try{var d=document.documentElement;`,
  `if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;`,
  `if(!("IntersectionObserver" in window))return;`,
  `d.dataset.motion="on";`,
  `addEventListener("load",function(){setTimeout(function(){`,
  `if(!("revealReady" in d.dataset))d.removeAttribute("data-motion")`,
  `},1200)})}catch(e){}})();`,
].join('')
