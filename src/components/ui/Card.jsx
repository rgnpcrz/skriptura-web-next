export default function Card({ children, className = '', hover = false, yellow = false }) {
  const base = 'border-2 border-ink p-4 sm:p-6'
  // The accent yellow is identical in both themes, so text on it stays black —
  // `ink` would flip to near-white in dark and vanish.
  const tone = yellow ? 'bg-accent text-on-accent' : 'bg-paper text-ink'
  const shadow = hover
    ? 'shadow-card transition-all duration-150 hover:shadow-card-hover hover:-translate-x-px hover:-translate-y-px cursor-pointer'
    : 'shadow-card'
  return (
    <div className={`${base} ${tone} ${shadow} ${className}`}>
      {children}
    </div>
  )
}
