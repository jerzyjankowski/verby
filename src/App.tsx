import { BrowserRouter, useRoutes } from 'react-router-dom'

import { buildFileSystemRoutes } from './routing/fileSystemRoutes'
import { ToastProvider } from './components/shared/Toast'

const routes = buildFileSystemRoutes()

export default function App() {
  function AppRoutes() {
    return useRoutes(routes)
  }

  const basename =
    import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

  return (
    <ToastProvider>
      <BrowserRouter basename={basename}>
        <AppRoutes />
      </BrowserRouter>
    </ToastProvider>
  )
}

