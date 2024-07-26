import { resolve } from 'path';
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  alias: {
    '@': resolve(__dirname, '/'),
  },
  css: ["~/assets/main.scss", "vuetify/styles", '@mdi/font/css/materialdesignicons.min.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  build: {
    transpile: ['vuetify'],
  },
  plugins: ['~/plugins/initAuth.ts', { src: '~/plugins/vuetify.ts', ssr: false }],
  router: {
    middleware: ['auth'],
  },
  vite: {
    plugins: [
      vuetify(),
    ],
  },
});