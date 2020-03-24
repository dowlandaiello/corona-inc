require('dotenv').config()

export default {
  dev: process.env.NODE_ENV !== 'production',
  env: {
    VUE_APP_GOOGLE_MAPS_API_KEY: process.env.VUE_APP_GOOGLE_MAPS_API_KEY
  },
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~assets/theme.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/google-maps.js',
    { src: '~plugins/state-persistence.js', ssr: false }
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-odule
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          //import whole set
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          }
        ]
      }
    ],
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/pwa',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyBe1_41UgE4hFSe6iri1PQlzNdoQb1qXF8',
          authDomain: 'corona-inc.firebaseapp.com',
          databaseURL: 'https://corona-inc.firebaseio.com',
          projectId: 'corona-inc',
          storageBucket: 'corona-inc.appspot.com',
          messagingSenderId: '599920780209',
          appId: '1:599920780209:web:6b7f119d79722e71c91390',
          measurementId: 'G-QBW6HJP18X'
        },
        services: {
          analytics: true,
          performance: true
        }
      }
    ]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line no-unused-vars
    transpile: [
      'vue2-gmap-custom-marker',
      'disintegrate',
      /^vue2-google-maps($|\/)/
    ]
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}
