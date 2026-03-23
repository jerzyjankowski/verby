import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import packageJson from './package.json'

/** GitHub Pages project URL; only applied for production build and preview. */
const PRODUCTION_BASE = '/verby/'

export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : PRODUCTION_BASE,
  define: {
    __APP_VERSION__: JSON.stringify(`v${packageJson.version}`),
  },
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
}))

