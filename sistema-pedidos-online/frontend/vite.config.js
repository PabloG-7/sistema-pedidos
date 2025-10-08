import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Config SIMPLES sem PWA por enquanto
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
})