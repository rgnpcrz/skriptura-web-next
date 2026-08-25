'use client'

import { useState, useRef } from 'react'
import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import SectionHeader from '@/components/ui/SectionHeader'
import { clients } from '@/data/clients'
import { services } from '@/data/services'
import { projects } from '@/data/projects'

const WORDMARK_CLICK_THRESHOLD = 5
const WORDMARK_WINDOW_MS = 2000

export default function HomeClient() {
  const { t } = useTranslation()
  const [secretMsg, setSecretMsg] = useState(false)
  const clickCount = useRef(0)
  const clickTimer = useRef(null)

  const handleWordmarkClick = () => {
    clickCount.current += 1
    if (clickCount.current >= WORDMARK_CLICK_THRESHOLD) {
      clickCount.current = 0
      clearTimeout(clickTimer.current)
      setSecretMsg(true)
      setTimeout(() => setSecretMsg(false), 3000)
      return
    }
    clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => { clickCount.current = 0 }, WORDMARK_WINDOW_MS)
  }

  const featuredClients = clients.slice(0, 4)
  const featuredServices = services.slice(0, 6)

  return (
    <div className="space-y-12 sm:space-y-16">

      {/* // WHO WE ARE */}
      <section data-reveal>
        <SectionHeader title={t('home.sectionWhoWeAre')} />
        <Card className="p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <button
                onClick={handleWordmarkClick}
                className="font-mono font-bold text-[clamp(1.75rem,9vw,4.5rem)] leading-none tracking-widest mb-6 block text-left select-none cursor-default"
                aria-label="Skriptura"
              >
                {secretMsg ? (
                  <span className="text-accent animate-pulse">WE&apos;RE HIRING...</span>
                ) : (
                  t('home.wordmark')
                )}
              </button>
              <p className="font-mono font-bold text-base sm:text-lg mb-4 max-w-2xl leading-relaxed">
                {t('home.tagline')}
              </p>
              <p className="font-mono text-sm sm:text-base text-ink/70 mb-8 max-w-2xl leading-relaxed">
                {t('home.mission')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button to="/clients" variant="solid">{t('home.ctaWork')}</Button>
                <Button to="/contact" variant="outline">{t('home.ctaContact')}</Button>
              </div>
            </div>
            <div className="border-2 border-ink p-4 bg-terminal text-accent font-mono text-xs lg:min-w-52">
              <p className="mb-1">{'>'} skriptura.net</p>
              <p className="mb-1">{'>'} est. 2023</p>
              <p className="mb-1">{'>'} prishtinë, xk</p>
              <p className="mb-1">{'>'} 7+ clients</p>
              <p className="animate-pulse">{'>'} <span className="bg-accent text-on-accent px-0.5">_</span></p>
            </div>
          </div>
        </Card>
      </section>

      {/* // BY THE NUMBERS */}
      <section data-reveal>
        <SectionHeader title={t('home.sectionNumbers')} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: t('home.statFounded'), value: t('home.statFoundedValue') },
            { label: t('home.statClients'), value: t('home.statClientsValue') },
            { label: t('home.statOwners'), value: t('home.statOwnersValue') },
            { label: t('home.statCity'), value: t('home.statCityValue'), small: true },
          ].map((stat) => (
            <Card key={stat.label} yellow className="text-center py-6">
              <p className={`font-mono font-bold mb-1 leading-tight ${stat.small ? 'text-lg sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>
                {stat.value}
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-on-accent/70">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* // WHAT WE DO */}
      <section data-reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <SectionHeader title={t('home.sectionWhatWeDo')} subtitle={t('home.sectionWhatWeDoSub')} className="mb-0 min-w-0" />
          <Link href="/services" className="font-mono text-sm font-bold hover:underline underline-offset-2 whitespace-nowrap">
            {t('home.viewAllServices')}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredServices.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="block group">
              <Card hover className="h-full flex flex-col">
                <h3 className="font-mono font-bold text-sm sm:text-base mb-2 group-hover:underline underline-offset-2">{service.name}</h3>
                <p className="font-mono text-xs sm:text-sm text-ink/70 flex-1 leading-relaxed">{service.shortDesc}</p>
                <p className="font-mono text-xs mt-4 font-bold">{t('services.viewService')}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* // CLIENTS */}
      <section data-reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <SectionHeader title={t('home.sectionClients')} subtitle={t('home.sectionClientsSub')} className="mb-0 min-w-0" />
          <Link href="/clients" className="font-mono text-sm font-bold hover:underline underline-offset-2 whitespace-nowrap">
            {t('home.viewAllClients')}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredClients.map((client) => (
            <Link key={client.slug} href={`/clients/${client.slug}`} className="block group">
              <Card hover className="h-full">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-mono font-bold text-sm sm:text-base group-hover:underline underline-offset-2">{client.name}</h3>
                  <Badge yellow className="shrink-0">{client.year}</Badge>
                </div>
                <p className="font-mono text-xs sm:text-sm text-ink/70 mb-3 leading-relaxed">{client.tagline}</p>
                <div className="flex flex-wrap gap-1.5">
                  {client.services.slice(0, 3).map((s) => (
                    <Badge key={s}>{s.replace(/-/g, ' ')}</Badge>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* // PROJECTS */}
      <section data-reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <SectionHeader title={t('home.sectionProjects')} subtitle={t('home.sectionProjectsSub')} className="mb-0 min-w-0" />
          <Link href="/projects" className="font-mono text-sm font-bold hover:underline underline-offset-2 whitespace-nowrap">
            {t('home.viewAllProjects')}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Card key={project.slug} hover className="h-full">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-mono font-bold text-sm sm:text-base">{project.name}</h3>
                <Badge yellow={project.status === 'live'} className="shrink-0">
                  {project.status === 'live' ? t('projects.statusLive') : t('projects.statusComingSoon')}
                </Badge>
              </div>
              <p className="font-mono text-xs sm:text-sm text-ink/70 mb-4 leading-relaxed">{project.tagline}</p>
              {project.url ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs font-bold hover:underline underline-offset-2">
                  {t('projects.playNow')}
                </a>
              ) : (
                <Link href={`/projects/${project.slug}`} className="font-mono text-xs font-bold hover:underline underline-offset-2">
                  {t('common.learnMore')}
                </Link>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* // GET IN TOUCH */}
      <section data-reveal>
        <SectionHeader title={t('home.sectionContact')} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="sm:col-span-2">
            <p className="font-mono text-sm sm:text-base mb-1">{t('home.contactLine1')}</p>
            <p className="font-mono text-sm sm:text-base text-ink/70 mb-6">{t('home.contactLine2')}</p>
            <Button to="/contact" variant="solid">{t('home.ctaContact')}</Button>
          </Card>
          <Card yellow>
            <p className="font-mono font-bold text-xs uppercase tracking-widest mb-3">{t('common.quickLinks')}</p>
            <ul className="space-y-2">
              <li><a href="tel:+38344564565" className="font-mono text-sm font-bold hover:underline underline-offset-2">+383 44 564 565</a></li>
              <li><a href="mailto:info@skriptura.net" className="font-mono text-sm hover:underline underline-offset-2">info@skriptura.net</a></li>
              <li className="font-mono text-sm text-on-accent/70">{t('contact.city')}</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}
