// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true
  },
  modules: [
    "@vite-pwa/nuxt"
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'XMP Panorama Fixer',
      short_name: 'Panorama Fixer',
      theme_color: '#008B8B',
      icons: [
        {
          purpose: "maskable",
          sizes: "512x512",
          src: "icon512_maskable.png",
          type: "image/png"
        },
        {
          purpose: "any",
          sizes: "512x512",
          src: "icon512_rounded.png",
          type: "image/png"
        }
      ],
      display: "standalone",
      lang: "en",
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    }
  }
})
