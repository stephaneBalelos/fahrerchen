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

    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY
    },
    
    public: {
      supabase_storage_url: process.env.SUPABASE_STORAGE_URL,
      app_version: pjson.version,
      stripe_pk: process.env.STRIPE_PK,
      base_url: process.env.BASE_URL,
      is_demo: process.env.NUXT_PUBLIC_IS_DEMO,
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
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/turnstile'
  ],

  ui: {
    global: true
  },

  extends: ['@nuxt/ui-pro'],

  supabase: {
    redirect: true,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production'
    },
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
  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY
  },

  compatibilityDate: '2024-07-15'
});