import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        'verby-bg': '#373958',
        'verby-text': '#EAE2F3',
        'verby-secondary': '#1A3A3A',
        'verby-error-text': '#DD9393',
        'verby-error-bg': '#932626',
      },
    },
  },
  plugins: [],
}

export default config

