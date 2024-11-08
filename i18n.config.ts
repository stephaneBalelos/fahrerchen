import en from './locales/en.json'
import de from './locales/de.json'

export default defineI18nConfig(() => ({
    legacy: false,
    allowComposition: true,
    globalInjection: true,
    availableLocales: ['de', 'en'],
    locale: 'de',
    fallbackLocale: 'de',
    messages: {
      de: de,
      en: en,
    },
  }))
  