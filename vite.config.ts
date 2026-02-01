import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Set the base path for GitHub Pages
  base: '/Fashion-Store-App/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // This ensures the manifest link in HTML includes the base path
      manifest: {
        name: 'Fashion Store Manager',
        short_name: 'BoutiqueApp',
        description: 'Manage inventory and finances for the boutique',
        theme_color: '#0F172A',
        background_color: '#ffffff',
        display: 'standalone', // Essential for the "Desktop App" feel
        scope: '/Fashion-Store-App/',
        start_url: '/Fashion-Store-App/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable' // Helps icons look good on all devices
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      // Important for GitHub Pages deployment
      workbox: {
        navigateFallbackDenylist: [/^\/Fashion-Store-App\/404/],
      }
    })
  ],
})