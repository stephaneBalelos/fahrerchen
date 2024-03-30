// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  imports: {
    autoImport: true,
  },

  // routeRules: {
  //   // prerender index route by default
  //   '/': { prerender: true },
  // },

  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/test-utils'
  ],
  extends: ['@nuxt/ui-pro'],
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/forgot-password']
    }
  },
  i18n: {
    vueI18n: './i18n.config.ts' 
  }
});