import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** GitHub project pages are served from /<repo>/; set VITE_BASE or rely on GITHUB_REPOSITORY in Actions. */
function appBase(): string {
  const fromEnv = process.env.VITE_BASE?.trim()
  if (fromEnv) return fromEnv.endsWith('/') ? fromEnv : `${fromEnv}/`
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (repo) return `/${repo}/`
  return '/'
}

export default defineConfig({
  base: appBase(),
  plugins: [
    react(),
    {
      name: 'spa-fallback-for-github-pages',
      closeBundle() {
        const dist = resolve(__dirname, 'dist')
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      },
    },
  ],
  server: {
    host: true,
    port: 3000,
  },
})

