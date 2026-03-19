import React from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'

import { buildFileSystemRoutes } from './routing/fileSystemRoutes'

const routes = buildFileSystemRoutes()

export default function App() {
  function AppRoutes() {
    return useRoutes(routes)
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

