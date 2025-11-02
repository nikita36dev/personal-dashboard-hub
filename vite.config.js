import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lucide': ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  },
  // Ensure public folder is served correctly
  publicDir: 'public'
})
