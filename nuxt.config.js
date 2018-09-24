const webpack = require('webpack');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'beauty',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js project'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#3B8070'},
  /*
  ** Build configuration
  */
  build: {

    /*
    ** Run ESLint on save
    */
    extend(config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.plugins.push(
        new webpack.EnvironmentPlugin(['APIKEY', 'AUTHDOMAIN', 'DATABASEURL', 'PROJECTID', 'STORAGEBUCKET', 'MESSAGINGSENDERID'])
      )
      // config.plugins.push(
      //   new webpack.EnvironmentPlugin(['APIKEY', 'AUTHDOMAIN', 'DATABASEURL', 'PROJECTID', 'STORAGEBUCKET', 'MESSAGINGSENDERID'])
      // )
    },
  },
  plugins: ['~/plugins/firebase', 
  { src: '~/plugins/localStorage.js', ssr: false }],

  router: {
    middleware: 'auth'
  },
  modules: [
    ['bootstrap-vue/nuxt', { css: true }],
    ['nuxt-fontawesome'],
    //OR like this
    
  ],
  css: [
    "@/assets/css/bootstrap-social.css",
    // '@fortawesome/fontawesome-svg-core',
    // '@fortawesome/free-solid-svg-icons',
    // '@fortawesome/vue-fontawesome'
  
  ],
  fontawesome: {
    component: 'fa',
    imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['fas']
        },
    ],
  }
  
}

