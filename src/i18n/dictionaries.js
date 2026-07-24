import en from './en.json'
import sq from './sq.json'
import { defaultLocale } from './config'

// Translations are bundled JSON (no async/backend), so lookup is synchronous.
// Loaded on the server and passed to the client via <TranslationProvider>.
const dictionaries = { en, sq }

export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries[defaultLocale]
}
