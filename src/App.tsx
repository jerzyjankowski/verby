import { BrowserRouter, useRoutes } from 'react-router-dom'

import { buildFileSystemRoutes } from './routing/fileSystemRoutes'
import { ToastProvider } from './components/shared/Toast'

const routes = buildFileSystemRoutes()

export default function App() {
  function AppRoutes() {
    return useRoutes(routes)
  }

  return (
    <ToastProvider>
      <BrowserRouter
        basename={
          import.meta.env.BASE_URL === '/'
            ? undefined
            : import.meta.env.BASE_URL.replace(/\/$/, '')
        }
      >
        <AppRoutes />
      </BrowserRouter>
    </ToastProvider>
  )
}

