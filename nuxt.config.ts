import { resolve } from "path";
import * as pjson from './package.json'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development'},

  imports: {
    autoImport: true,
  },

  vite: {
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, 'components')}
      ]
    }
  },

  nitro: {
    preset: 'vercel-edge'
  },

  runtimeConfig: {

    stripe_pk: process.env.STRIPE_PK,
    stripe_sk: process.env.STRIPE_SK,
    stripe_wh: process.env.STRIPE_WEBHOOK_SECRET,
    
    public: {
      supabase_storage_url: process.env.SUPABASE_STORAGE_URL,
      app_version: pjson.version,
      stripe_pk: process.env.STRIPE_PK,
    }
  },

  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
    // /my routes are not ssr
    '/my/**': { ssr: false },

  },
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module',
    '@pinia/nuxt'
  ],

  ui: {
    global: true
  },

  extends: ['@nuxt/ui-pro'],

  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/forgot-password', '/confirm', '/login', '/signup', '/external/*'],
      cookieRedirect: true
    }
  },

  i18n: {
    strategy: 'no_prefix',
    locales: ['de', 'en'],
    defaultLocale: 'de',
    vueI18n: './i18n.config.ts' 
  },

  compatibilityDate: '2024-07-15'
});