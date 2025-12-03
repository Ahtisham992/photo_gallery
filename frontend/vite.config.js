import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://16.16.65.200:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: false
  }
})
