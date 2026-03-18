import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeEmptyPage from './pages/HomeEmptyPage'
import InitPage from './pages/InitPage'
import LessonPage from './pages/LessonPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeEmptyPage />} />
        <Route path="/init" element={<InitPage />} />
        <Route path="/lesson/_new" element={<LessonPage />} />
      </Routes>
    </BrowserRouter>
  )
}

