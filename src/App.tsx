import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeEmptyPage from './pages/HomeEmptyPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeEmptyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

