import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/leaflet/')) return 'leaflet'
          if (id.includes('/node_modules/vue/')) return 'vue'
        },
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 8765,
  },
  preview: {
    host: '127.0.0.1',
    port: 8765,
  },
})
