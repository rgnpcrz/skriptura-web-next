export default function Card({ children, className = '', hover = false, yellow = false }) {
  const base = 'border-2 border-black bg-white p-4 sm:p-6'
  const shadow = hover
    ? 'shadow-card transition-all duration-150 hover:shadow-card-hover hover:-translate-x-px hover:-translate-y-px cursor-pointer'
    : 'shadow-card'
  const bg = yellow ? 'bg-accent' : 'bg-white'
  return (
    <div className={`${base} ${shadow} ${bg} ${className}`}>
      {children}
    </div>
  )
}
