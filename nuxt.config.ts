// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },

  modules: ['@nuxtjs/supabase', '@nuxt/ui'],
  extends: ['@nuxt/ui-pro'],
  supabase: {
    redirect: false
  }
});