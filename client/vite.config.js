import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_URL || 'http://localhost:5101',
        changeOrigin: true,
        secure: false
      },
      '/imgs': {
        target: import.meta.env.VITE_IMAGES_URL || 'http://localhost:5101',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
