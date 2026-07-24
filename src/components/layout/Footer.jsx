'use client'

import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t-2 border-black bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <p className="font-mono font-bold text-xl tracking-widest mb-2">SKRIPTURA</p>
            <p className="font-mono text-xs text-black/60 mb-4 max-w-xs">{t('home.mission')}</p>
            <p className="font-mono text-xs text-black/50">Skriptura SH.P.K. · NUI: 812112431</p>
          </div>
          <div>
            <p className="font-mono font-bold text-xs uppercase tracking-widest mb-3 border-b border-black pb-2">
              {t('nav.home')}
            </p>
            <ul className="space-y-2">
              {[
                { href: '/about', label: t('nav.about') },
                { href: '/services', label: t('nav.services') },
                { href: '/clients', label: t('nav.clients') },
                { href: '/projects', label: t('nav.projects') },
                { href: '/contact', label: t('nav.contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-mono text-xs text-black/70 hover:text-black hover:underline underline-offset-2">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono font-bold text-xs uppercase tracking-widest mb-3 border-b border-black pb-2">
              {t('nav.contact')}
            </p>
            <ul className="space-y-2">
              <li><a href="mailto:info@skriptura.net" className="font-mono text-xs text-black/70 hover:text-black hover:underline underline-offset-2">info@skriptura.net</a></li>
              <li><a href="tel:+38344564565" className="font-mono text-xs text-black/70 hover:text-black hover:underline underline-offset-2">+383 44 564 565</a></li>
              <li className="font-mono text-xs text-black/60">Prishtinë, Kosovo</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-black mt-8 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-xs text-black/50">© {year} Skriptura SH.P.K. All rights reserved.</p>
          <p className="font-mono text-xs text-black/30 select-none">{'// built with purpose'}</p>
        </div>
      </div>
    </footer>
  )
}
