import { BrowserRouter, useRoutes } from 'react-router-dom'

import { buildFileSystemRoutes } from './routing/fileSystemRoutes'
import { ToastProvider } from './components/shared/Toast'

const routes = buildFileSystemRoutes()

/** Must match Vite `base` so routes resolve under e.g. /verby on GitHub Pages and in dev. */
const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  function AppRoutes() {
    return useRoutes(routes)
  }

  return (
    <ToastProvider>
      <BrowserRouter basename={routerBasename}>
        <AppRoutes />
      </BrowserRouter>
    </ToastProvider>
  )
}

