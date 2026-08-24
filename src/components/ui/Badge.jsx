export default function Badge({ children, yellow = false, className = '' }) {
  const base = 'inline-block font-mono text-xs font-bold px-2 py-0.5 border border-ink uppercase tracking-wide'
  const color = yellow ? 'bg-accent text-on-accent' : 'bg-paper text-ink'
  return <span className={`${base} ${color} ${className}`}>{children}</span>
}
