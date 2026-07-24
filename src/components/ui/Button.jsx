import Link from '@/components/ui/LocaleLink'

export default function Button({ children, to, href, onClick, variant = 'solid', className = '', type = 'button', ...props }) {
  const base = 'inline-block font-mono font-bold text-sm px-5 py-2.5 border-2 border-black transition-all duration-150 cursor-pointer select-none'
  const variants = {
    solid: 'bg-black text-white hover:bg-accent hover:text-black',
    outline: 'bg-white text-black hover:bg-black hover:text-white',
    yellow: 'bg-accent text-black hover:bg-black hover:text-accent border-black',
  }
  const cls = `${base} ${variants[variant]} ${className}`

  if (to) return <Link href={to} className={cls} {...props}>{children}</Link>
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props}>{children}</a>
  return <button type={type} onClick={onClick} className={cls} {...props}>{children}</button>
}
