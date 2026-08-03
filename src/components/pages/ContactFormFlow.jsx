'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation, useLocale } from '@/i18n/client'
import Button from '@/components/ui/Button'

const EMPTY = { name: '', email: '', message: '', company: '' }

const FIELD_CLASS =
  'w-full border-2 border-black px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent transition-colors bg-white disabled:opacity-50'

// API error codes → translation keys.
const ERROR_KEYS = {
  invalid_fields: 'contact.formErrorInvalid',
  rate_limited: 'contact.formErrorRate',
  too_many_codes: 'contact.codeErrorResendLimit',
  invalid_code: 'contact.codeErrorInvalid',
  expired: 'contact.codeErrorExpired',
  too_many_attempts: 'contact.codeErrorAttempts',
  invalid_token: 'contact.codeErrorToken',
}

// Errors that end mid-sentence and get "info@skriptura.net" appended. The code
// step's own errors are self-contained — telling someone to email us because a
// digit was mistyped would be absurd.
const WITH_MAILTO = new Set([
  'contact.formError',
  'contact.formErrorInvalid',
  'contact.formErrorRate',
  'contact.codeErrorResendLimit',
  'contact.codeErrorToken',
])

const RESEND_COOLDOWN = 60

function mmss(total) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok && data.ok, data }
}

export default function ContactFormFlow() {
  const { t } = useTranslation()
  const locale = useLocale()

  const [form, setForm] = useState(EMPTY)
  // form → code → done. `done` covers both a verified inquiry and the
  // no-token path (honeypot), which differ only in the copy shown.
  const [phase, setPhase] = useState('form')
  const [doneKind, setDoneKind] = useState('verified')
  const [busy, setBusy] = useState(false)

  const [token, setToken] = useState(null)
  const [code, setCode] = useState('')
  const [expiresIn, setExpiresIn] = useState(0)
  const [cooldown, setCooldown] = useState(0)

  // { tone: 'error' | 'info', key, value? } — value carries e.g. attempts left.
  const [notice, setNotice] = useState(null)
  const codeInput = useRef(null)

  // One ticker drives both the expiry countdown and the resend cooldown.
  useEffect(() => {
    if (phase !== 'code') return
    const id = setInterval(() => {
      setExpiresIn((s) => (s > 0 ? s - 1 : 0))
      setCooldown((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase === 'code') codeInput.current?.focus()
  }, [phase])

  const fail = (data) => {
    setNotice({
      tone: 'error',
      key: ERROR_KEYS[data?.error] || 'contact.formError',
      value: data?.remaining,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setNotice(null)

    try {
      const { ok, data } = await post('/api/contact', { ...form, lang: locale })
      if (!ok) return fail(data)

      // No token means the submission was swallowed (honeypot). Show the plain
      // sent state rather than parking them on a code that will never arrive.
      if (!data.token) {
        setDoneKind('sent')
        setPhase('done')
        return
      }

      setToken(data.token)
      setExpiresIn(data.expiresIn || 600)
      setCooldown(RESEND_COOLDOWN)
      setCode('')
      setPhase('code')
    } catch {
      setNotice({ tone: 'error', key: 'contact.formError' })
    } finally {
      setBusy(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (busy || code.length !== 6) return
    setBusy(true)
    setNotice(null)

    try {
      const { ok, data } = await post('/api/contact/verify', { token, code })
      if (!ok) {
        fail(data)
        setCode('')
        codeInput.current?.focus()
        return
      }
      setForm(EMPTY)
      setDoneKind('verified')
      setPhase('done')
    } catch {
      setNotice({ tone: 'error', key: 'contact.formError' })
    } finally {
      setBusy(false)
    }
  }

  const handleResend = async () => {
    if (busy || cooldown > 0) return
    setBusy(true)
    setNotice(null)

    try {
      const { ok, data } = await post('/api/contact/resend', { token })
      if (!ok) {
        // The server owns the cooldown; mirror whatever it reports back. A
        // clock that drifted under the button's own countdown is not an error
        // worth showing — just re-sync and let them try again.
        if (data?.retryAfter) setCooldown(data.retryAfter)
        if (data?.error !== 'cooldown') fail(data)
        return
      }
      setExpiresIn(data.expiresIn || 600)
      setCooldown(RESEND_COOLDOWN)
      setCode('')
      setNotice({ tone: 'info', key: 'contact.codeResent' })
      codeInput.current?.focus()
    } catch {
      setNotice({ tone: 'error', key: 'contact.formError' })
    } finally {
      setBusy(false)
    }
  }

  const startOver = () => {
    setPhase('form')
    setToken(null)
    setCode('')
    setNotice(null)
  }

  const noticeBox = notice && (
    <p
      className={`font-mono text-sm border-2 border-black px-3 py-2 ${
        notice.tone === 'info' ? 'bg-accent' : 'bg-white'
      }`}
    >
      {t(notice.key)}
      {notice.value !== undefined && <span className="font-bold"> {notice.value}</span>}
      {WITH_MAILTO.has(notice.key) && (
        <>
          {' '}
          <a href="mailto:info@skriptura.net" className="font-bold underline underline-offset-2">
            info@skriptura.net
          </a>
        </>
      )}
    </p>
  )

  if (phase === 'done') {
    return (
      <div className="space-y-3" aria-live="polite">
        <p className="font-mono text-sm border-2 border-black bg-accent px-3 py-2 font-bold">
          {doneKind === 'verified' ? t('contact.verifiedTitle') : t('contact.formSuccess')}
        </p>
        {doneKind === 'verified' && (
          <p className="font-mono text-sm text-black/70">{t('contact.verifiedBody')}</p>
        )}
      </div>
    )
  }

  if (phase === 'code') {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest font-bold text-black/60 mb-2">
            {t('contact.codeStepTitle')}
          </p>
          <p className="font-mono text-sm">
            {t('contact.codeStepSentTo')} <span className="font-bold break-all">{form.email}</span>
          </p>
          <p className="font-mono text-xs text-black/60 mt-2">{t('contact.codeStepReassure')}</p>
        </div>

        <div>
          <label
            htmlFor="contact-code"
            className="font-mono text-xs uppercase tracking-wide font-bold block mb-1"
          >
            {t('contact.codeLabel')}
          </label>
          <input
            id="contact-code"
            ref={codeInput}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            disabled={busy}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={`${FIELD_CLASS} text-center text-2xl tracking-[0.5em] font-bold`}
          />
          <p className="font-mono text-xs text-black/50 mt-1">
            {expiresIn > 0 ? `${t('contact.codeExpiresIn')} ${mmss(expiresIn)}` : t('contact.codeErrorExpired')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            variant="solid"
            disabled={busy || code.length !== 6}
            className={busy || code.length !== 6 ? 'opacity-60 cursor-not-allowed' : ''}
          >
            {busy ? t('contact.codeVerifying') : t('contact.codeSubmit')}
          </Button>
          <button
            type="button"
            onClick={handleResend}
            disabled={busy || cooldown > 0}
            className="font-mono text-xs underline underline-offset-2 disabled:no-underline disabled:text-black/40 disabled:cursor-not-allowed"
          >
            {cooldown > 0 ? `${t('contact.codeResendWait')} ${cooldown}s` : t('contact.codeResend')}
          </button>
        </div>

        <div aria-live="polite">{noticeBox}</div>

        <div className="border-t-2 border-black pt-3 space-y-1">
          <p className="font-mono text-xs text-black/50">{t('contact.codeNoMail')}</p>
          <button
            type="button"
            onClick={startOver}
            className="font-mono text-xs underline underline-offset-2"
          >
            {t('contact.codeChangeEmail')}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { key: 'name', label: t('contact.formName'), type: 'text', autoComplete: 'name' },
        { key: 'email', label: t('contact.formEmail'), type: 'email', autoComplete: 'email' },
      ].map(({ key, label, type, autoComplete }) => (
        <div key={key}>
          <label className="font-mono text-xs uppercase tracking-wide font-bold block mb-1">{label}</label>
          <input
            type={type}
            required
            autoComplete={autoComplete}
            disabled={busy}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className={FIELD_CLASS}
          />
        </div>
      ))}
      <div>
        <label className="font-mono text-xs uppercase tracking-wide font-bold block mb-1">
          {t('contact.formMessage')}
        </label>
        <textarea
          required
          rows={5}
          disabled={busy}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${FIELD_CLASS} resize-none`}
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
          disabled={busy}
          className={busy ? 'opacity-60 cursor-wait' : ''}
        >
          {busy ? t('contact.formSending') : t('contact.formSubmit')}
        </Button>
        <p className="font-mono text-xs text-black/50">{t('contact.formNote')}</p>
      </div>

      <div aria-live="polite">{noticeBox}</div>

      <p className="font-mono text-xs text-black/40 border-t-2 border-black pt-3">
        {t('contact.privacyNote')}
      </p>
    </form>
  )
}
