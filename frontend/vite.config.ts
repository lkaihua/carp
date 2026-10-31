import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/~/': {
        target: 'http://127.0.0.1:8100',
        bypass(req) {
          // Browser navigation belongs to React; data and media belong to Go.
          if (req.headers.accept?.includes('text/html')) return '/index.html'
        },
      },
      '/info/': 'http://127.0.0.1:8100',
      '/qr/': 'http://127.0.0.1:8100',
    },
  },
})
