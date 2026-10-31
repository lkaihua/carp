import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { API_PREFIX } from './src/constants/routes'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      [API_PREFIX]: 'http://127.0.0.1:8100',
    },
  },
})
