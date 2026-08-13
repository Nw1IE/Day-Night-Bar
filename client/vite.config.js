import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5101', // порт твоего бэкенда
        changeOrigin: true,
        secure: false
      }
    }
  }
})