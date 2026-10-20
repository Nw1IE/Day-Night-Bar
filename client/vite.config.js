import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5101',
        changeOrigin: true,
        secure: false
      },
      '/imgs': {
        target: process.env.VITE_IMAGES_URL || 'http://localhost:5101',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
