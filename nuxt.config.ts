import { resolve } from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development'},
  imports: {
    autoImport: true,
  },

  vite: {
    resolve: {
      alias: [
        { find: '@/components', replacement: resolve(__dirname, 'components')}
      ]
    }
  },

  runtimeConfig: {
    public: {
      supabase_storage_url: process.env.SUPABASE_STORAGE_URL,
    }
  },

  // routeRules: {
  //   // prerender index route by default
  //   '/': { prerender: true },
  // },
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module'
  ],
  extends: ['@nuxt/ui-pro'],
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/callback',
      exclude: ['/forgot-password', '/account/password-reset', '/confirm', '/login']
    }
  },
  i18n: {
    vueI18n: './i18n.config.ts' 
  }
});