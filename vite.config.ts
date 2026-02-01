import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Ensure the base path is used for all assets
  base: '/Fashion-Store-App/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Fashion Store Manager',
        short_name: 'BoutiqueApp',
        description: 'Manage inventory and finances for the boutique',
        theme_color: '#0F172A',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/Fashion-Store-App/',
        start_url: '/Fashion-Store-App/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // This ensures your CSS/JS files are cached and served correctly
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallbackDenylist: [/^\/Fashion-Store-App\/404/],
      }
    })
  ],
  build: {
    // Explicitly link assets to the base path
    assetsDir: 'assets',
    cssCodeSplit: false, // Bundles CSS into one file to prevent loading issues
  }
})