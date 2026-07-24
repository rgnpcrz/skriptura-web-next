// Shared i18n constants — safe to import from anywhere (server, client, proxy).
export const locales = ['en', 'sq']
export const defaultLocale = 'en'

export function isLocale(value) {
  return locales.includes(value)
}
