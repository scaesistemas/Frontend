module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pwa: {
    themeColor: "#f6631e",
    msTileColor: "#f6631e",
    name: "Scae",
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'white',
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./src/service-worker.js"
    },
    manifestOptions: {
      background_color: "#f6631e",
      theme_color: "#f6631e",
    }
  },
   
}