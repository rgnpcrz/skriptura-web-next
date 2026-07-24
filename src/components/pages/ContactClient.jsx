'use client'

import { useState } from 'react'
import { useTranslation } from '@/i18n/client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import SectionHeader from '@/components/ui/SectionHeader'

export default function ContactClient() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Inquiry from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:info@skriptura.net?subject=${subject}&body=${body}`
  }

  return (
    <div className="space-y-12">
      <SectionHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <p className="text-xs uppercase tracking-widest font-bold text-black/60 mb-1">{label}</p>
                  {content}
                </div>
              ))}
              <div className="border-t-2 border-black pt-3">
                <p className="text-sm">{t('contact.address')}</p>
                <p className="text-sm text-black/70">{t('contact.city')}</p>
              </div>
            </div>
          </Card>
          <div>
            <SectionHeader title={t('contact.sectionRegistration')} />
            <Card>
              <div className="font-mono text-sm space-y-2">
                <div className="flex justify-between border-b border-black/10 pb-2">
                  <span className="text-black/60 text-xs uppercase tracking-wide font-bold">{t('contact.nuiLabel')}</span>
                  <span title="yes, we're legit" className="cursor-help underline decoration-dotted underline-offset-2">812112431</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-black/60 text-xs uppercase tracking-wide font-bold">{t('contact.arbkLabel')}</span>
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
                { key: 'name', label: t('contact.formName'), type: 'text' },
                { key: 'email', label: t('contact.formEmail'), type: 'email' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="font-mono text-xs uppercase tracking-wide font-bold block mb-1">{label}</label>
                  <input
                    type={type}
                    required
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent transition-colors bg-white"
                  />
                </div>
              ))}
              <div>
                <label className="font-mono text-xs uppercase tracking-wide font-bold block mb-1">{t('contact.formMessage')}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent transition-colors resize-none bg-white"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button type="submit" variant="solid">{t('contact.formSubmit')}</Button>
                <p className="font-mono text-xs text-black/50">{t('contact.formNote')}</p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
