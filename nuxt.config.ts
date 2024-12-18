// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },

  modules: ['@nuxtjs/supabase', '@nuxt/ui', '@nuxtjs/i18n'],
  extends: ['@nuxt/ui-pro'],
  supabase: {
    redirect: false
  },
  i18n: {
    vueI18n: './i18n.config.ts' 
  }
});