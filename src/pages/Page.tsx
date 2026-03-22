import { useNavigate } from 'react-router-dom'

import Button from '../components/shared/Button.tsx'
import { ui } from '../locales/index.ts'
import { loadCurrentLessonFromLocalStorage } from '../utils/localStorage.ts'
import {
  LESSON_PAGE_URL,
  LIBRARY_PAGE_URL,
  MARKED_VERBS_PAGE_URL,
  PREPARE_LESSON_PAGE_URL,
} from '../consts/urls.ts'

export default function Page() {
  const navigate = useNavigate()
  const hasNewLessonToContinue = !!loadCurrentLessonFromLocalStorage()

  return (
    <div className="min-h-screen bg-primary text-primary-text p-4">
      <div className="mx-auto max-w-2xl">
        <div className="verby-card bg-primary-darkest p-4 flex flex-col gap-3">
          {hasNewLessonToContinue ? (
            <Button onClick={() => navigate(LESSON_PAGE_URL)} label={ui.home.continue} />
          ) : null}
          <Button onClick={() => navigate(PREPARE_LESSON_PAGE_URL)} label={ui.home.newLesson} />
          <Button onClick={() => navigate(MARKED_VERBS_PAGE_URL)} label={ui.home.markedVerbs} />
          <Button onClick={() => navigate(LIBRARY_PAGE_URL)} label={ui.home.library} />
        </div>
      </div>
    </div>
  )
}
