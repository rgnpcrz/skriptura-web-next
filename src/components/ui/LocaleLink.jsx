'use client'

import Link from 'next/link'
import { useLocale } from '@/i18n/client'

// Internal <Link> replacement that prefixes app paths with the active locale.
// External links (http…, mailto:, tel:, #anchors) are passed through untouched.
export default function LocaleLink({ href, ...props }) {
  const locale = useLocale()
  let finalHref = href
  if (typeof href === 'string' && href.startsWith('/')) {
    finalHref = `/${locale}${href === '/' ? '' : href}`
  }
  return <Link href={finalHref} {...props} />
}
