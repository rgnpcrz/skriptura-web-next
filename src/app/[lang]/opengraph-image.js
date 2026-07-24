import { ImageResponse } from 'next/og'
import { isLocale } from '@/i18n/config'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Skriptura — Custom Software & Web Development'

export default async function Image({ params }) {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : 'en'
  const tagline =
    locale === 'sq'
      ? 'Zhvillim Softueri & Web · Prishtinë, Kosovë'
      : 'Custom Software & Web Development · Prishtinë, Kosovo'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#000000',
          padding: '80px',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            fontSize: 150,
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#ffffff',
            display: 'flex',
          }}
        >
          SKRIPTURA
        </div>
        <div
          style={{
            marginTop: 24,
            height: 12,
            width: 320,
            background: '#FFE600',
            display: 'flex',
          }}
        />
        <div
          style={{
            marginTop: 40,
            fontSize: 40,
            color: '#FFE600',
            display: 'flex',
          }}
        >
          {`> ${tagline}`}
        </div>
      </div>
    ),
    size
  )
}
