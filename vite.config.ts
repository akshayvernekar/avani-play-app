import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: '/avani-play-app/', // GitHub Pages base path
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: "Avani's Little World",
        short_name: "Avani's World",
        description: "Fun, friendly educational game and jigsaw puzzles for toddlers.",
        theme_color: '#4FC3F7',
        background_color: '#E0F7FA',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'https://via.placeholder.com/192.png?text=Avani',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://via.placeholder.com/512.png?text=Avani',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'https://via.placeholder.com/512.png?text=Avani',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,mp3,wav}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 3000
  }
})
