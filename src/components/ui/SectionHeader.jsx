export default function SectionHeader({ title, subtitle, className = '' }) {
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      <h2 className="font-mono font-bold text-xl sm:text-2xl tracking-tight border-b-4 border-black pb-2 inline-block">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-black/70 max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}
