import { defineConfig } from 'vite';

export default defineConfig({
  root: 'client',
  server: {
    port: 5173, // Твой текущий порт фронтенда
server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5101',
        changeOrigin: true,
        secure: false,
      }
    }
  }
  }
});