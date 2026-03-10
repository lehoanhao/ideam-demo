// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@pinia/nuxt'
  ],

  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  colorMode: {
    preference: 'light'
  },

  routeRules: {
    '/': {
      redirect: '/proposals'
    }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    esbuild: {
      options: {
        tsconfigRaw: {
          compilerOptions: {
            skipLibCheck: true
          }
        }
      }
    }
  },

  typescript: {
    typeCheck: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    },
    checker: false
  }
})
