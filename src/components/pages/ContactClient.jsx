'use client'

import { useState } from 'react'
import { useTranslation, useLocale } from '@/i18n/client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import SectionHeader from '@/components/ui/SectionHeader'

const EMPTY = { name: '', email: '', message: '', company: '' }

// Error codes from /api/contact → translation keys.
const ERROR_KEYS = {
  invalid_fields: 'contact.formErrorInvalid',
  rate_limited: 'contact.formErrorRate',
}

export default function ContactClient() {
  const { t } = useTranslation()
  const locale = useLocale()
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorKey, setErrorKey] = useState('contact.formError')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang: locale }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        setErrorKey(ERROR_KEYS[data.error] || 'contact.formError')
        setStatus('error')
        return
      }
      setForm(EMPTY)
      setStatus('sent')
    } catch {
      setErrorKey('contact.formError')
      setStatus('error')
    }
  }

  return (
    <div className="space-y-12">
      <SectionHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />
      <div data-reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SectionHeader title={t('contact.sectionInfo')} />
          <Card yellow>
            <div className="space-y-4 font-mono">
              {[
                { label: t('contact.labelPhone'), content: <a href="tel:+38344564565" className="text-sm sm:text-base font-bold hover:underline underline-offset-2">+383 44 564 565</a> },
                { label: t('contact.labelEmail'), content: <a href="mailto:info@skriptura.net" className="text-sm sm:text-base hover:underline underline-offset-2">info@skriptura.net</a> },
                { label: t('contact.labelBizEmail'), content: <a href="mailto:skriptura.co@gmail.com" className="text-sm sm:text-base hover:underline underline-offset-2">skriptura.co@gmail.com</a> },
              ].map(({ label, content }) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-widest font-bold text-on-accent/60 mb-1">{label}</p>
                  {content}
                </div>
              ))}
              <div className="border-t-2 border-on-accent pt-3">
                <p className="text-sm">{t('contact.address')}</p>
                <p className="text-sm text-on-accent/70">{t('contact.city')}</p>
              </div>
            </div>
          </Card>
          <div>
            <SectionHeader title={t('contact.sectionRegistration')} />
            <Card>
              <div className="font-mono text-sm space-y-2">
                <div className="flex justify-between border-b border-ink/10 pb-2">
                  <span className="text-ink/60 text-xs uppercase tracking-wide font-bold">{t('contact.nuiLabel')}</span>
                  <span title="yes, we're legit" className="cursor-help underline decoration-dotted underline-offset-2">812112431</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-ink/60 text-xs uppercase tracking-wide font-bold">{t('contact.arbkLabel')}</span>
                  <Badge yellow>{t('contact.arbkValue')}</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="space-y-4">
          <SectionHeader title={t('contact.sectionForm')} />
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', label: t('contact.formName'), type: 'text', autoComplete: 'name' },
                { key: 'email', label: t('contact.formEmail'), type: 'email', autoComplete: 'email' },
              ].map(({ key, label, type, autoComplete }) => (
                <div key={key}>
                  <label htmlFor={`contact-${key}`} className="font-mono text-xs uppercase tracking-wide font-bold block mb-1">{label}</label>
                  <input
                    id={`contact-${key}`}
                    type={type}
                    required
                    autoComplete={autoComplete}
                    disabled={status === 'sending'}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border-2 border-ink px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent transition-colors bg-paper disabled:opacity-50"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="contact-message" className="font-mono text-xs uppercase tracking-wide font-bold block mb-1">{t('contact.formMessage')}</label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  disabled={status === 'sending'}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border-2 border-ink px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent transition-colors resize-none bg-paper disabled:opacity-50"
                />
              </div>
              {/* Honeypot: hidden from people, irresistible to bots. */}
              <div
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
              >
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  variant="solid"
                  disabled={status === 'sending'}
                  className={status === 'sending' ? 'opacity-60 cursor-wait' : ''}
                >
                  {status === 'sending' ? t('contact.formSending') : t('contact.formSubmit')}
                </Button>
                <p className="font-mono text-xs text-ink/50">{t('contact.formNote')}</p>
              </div>
              <div aria-live="polite">
                {status === 'sent' && (
                  <p className="font-mono text-sm border-2 border-ink bg-accent text-on-accent px-3 py-2">
                    {t('contact.formSuccess')}
                  </p>
                )}
                {status === 'error' && (
                  <p className="font-mono text-sm border-2 border-ink bg-paper px-3 py-2">
                    {t(errorKey)}{' '}
                    <a href="mailto:info@skriptura.net" className="font-bold underline underline-offset-2">
                      info@skriptura.net
                    </a>
                  </p>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
