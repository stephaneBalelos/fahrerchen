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
    preset: 'vercel-edge',
  },

  runtimeConfig: {
    
    public: {
      supabase_storage_url: process.env.SUPABASE_STORAGE_URL,
      app_version: pjson.version,
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