// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size limit
    outDir: 'dist',
    sourcemap: false // Disable sourcemaps for smaller build
  },
  server: {
    port: 5173
  }
})
