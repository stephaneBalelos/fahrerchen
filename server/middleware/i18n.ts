import { createI18n } from 'vue-i18n'
import de from '../../locales/de.json'
import en from '../../locales/en.json'


const i18n = createI18n({
    legacy: false,
    availableLocales: ['de', 'en'],
    locale: 'de',
    messages: {
        de, en
    },
    fallbackLocale: 'de'
}).global


export default defineEventHandler(event => {
    const locale = (getCookie(event, 'i18n_redirected') || i18n.fallbackLocale.toString()) as 'de' | 'en'
    i18n.locale.value = locale
    event.context.$t = i18n.t
})

declare module 'h3' {
    interface H3EventContext {
        $t: typeof i18n.t
    }
}