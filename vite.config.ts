import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/verby',
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
})

