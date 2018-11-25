const webpack = require('webpack');

module.exports = {
  mode: "universal",
  srcDir: "app",
  /*
   ** Headers of the page
   */
  head: {
    title: "beauty",
    titleTemplate: "%s | beauty",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
      config.plugins.push(
        new webpack.EnvironmentPlugin([
          "APIKEY",
          "AUTHDOMAIN",
          "DATABASEURL",
          "PROJECTID",
          "STORAGEBUCKET",
          "MESSAGINGSENDERID"
        ])
      );
      // config.plugins.push(
      //   new webpack.EnvironmentPlugin(['APIKEY', 'AUTHDOMAIN', 'DATABASEURL', 'PROJECTID', 'STORAGEBUCKET', 'MESSAGINGSENDERID'])
      // )
    }
  },
  axios: {
    baseURL: process.env.DATABASEURL
  },
  plugins: [
    { src: "~/plugins/localStorage.js", ssr: false },
    { src: "~/plugins/fontawesome.js", ssr: false },
    '@/plugins/element-ui.js'
  ],

  router: {
    middleware: ["auth"]
  },
  modules: [["bootstrap-vue/nuxt", { css: true }, "@nuxtjs/axios"]],
  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    'element-ui/lib/theme-chalk/reset.css',
    'element-ui/lib/theme-chalk/index.css'
  ]
};

