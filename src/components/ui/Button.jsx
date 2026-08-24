import Link from '@/components/ui/LocaleLink'

export default function Button({ children, to, href, onClick, variant = 'solid', className = '', type = 'button', ...props }) {
  const base = 'inline-block font-mono font-bold text-sm px-5 py-2.5 border-2 border-ink transition-all duration-150 cursor-pointer select-none'
  const variants = {
    solid: 'bg-ink text-paper hover:bg-accent hover:text-on-accent',
    outline: 'bg-paper text-ink hover:bg-ink hover:text-paper',
    // Deepens rather than inverting: `ink` on hover would put white behind
    // yellow text in the dark theme.
    yellow: 'bg-accent text-on-accent hover:bg-accent-strong',
  }
  const cls = `${base} ${variants[variant]} ${className}`

  if (to) return <Link href={to} className={cls} {...props}>{children}</Link>
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props}>{children}</a>
  return <button type={type} onClick={onClick} className={cls} {...props}>{children}</button>
}
