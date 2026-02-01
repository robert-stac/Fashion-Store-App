import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  // Use the repo name on build (GitHub), but '/' on local dev (Laptop)
  base: command === 'serve' ? '/' : '/Fashion-Store-App/',
  build: {
    cssCodeSplit: false, // This forces ALL CSS into one single file
    assetsInlineLimit: 0, // Prevents small assets from being turned into Base64
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Fashion Store Manager',
        short_name: 'BoutiqueApp',
        display: 'standalone',
        // Use dynamic paths for PWA as well
        scope: command === 'serve' ? '/' : '/Fashion-Store-App/',
        start_url: command === 'serve' ? '/' : '/Fashion-Store-App/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
}))