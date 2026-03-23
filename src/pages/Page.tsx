import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import RandomQuote from '../components/menu/RandomQuote.tsx'
import Button from '../components/shared/Button.tsx'
import { ui } from '../locales'
import { loadCurrentLessonFromLocalStorage } from '../utils/localStorage.ts'
import { runVersionMigrations } from '../utils/versionMigration.utils.ts'
import {
  LESSON_PAGE_URL,
  LIBRARY_PAGE_URL,
  MARKED_VERBS_PAGE_URL,
  PREPARE_LESSON_PAGE_URL,
  SETTINGS_PAGE_URL,
} from '../consts/urls.ts'

export default function Page() {
  const navigate = useNavigate()
  const hasNewLessonToContinue = !!loadCurrentLessonFromLocalStorage()

  useEffect(() => {
    runVersionMigrations(__APP_VERSION__)
  }, [])

  return (
    <div className="relative min-h-screen bg-primary text-primary-text p-4 pb-36">
      <div className="mx-auto max-w-2xl">
        <div className="verby-card bg-primary-darkest p-4 flex flex-col gap-3">
          {hasNewLessonToContinue ? (
            <Button onClick={() => navigate(LESSON_PAGE_URL)} label={ui.home.continue} />
          ) : null}
          <Button onClick={() => navigate(PREPARE_LESSON_PAGE_URL)} label={ui.home.newLesson} />
        </div>
      </div>
      <RandomQuote />
      <div className="fixed bottom-10 left-0 right-0 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="verby-card bg-primary-darkest p-4 flex flex-col gap-3">
            <Button onClick={() => navigate(LIBRARY_PAGE_URL)} label={ui.home.library} />
            <Button onClick={() => navigate(MARKED_VERBS_PAGE_URL)} label={ui.home.markedVerbs} />
            <Button onClick={() => navigate(SETTINGS_PAGE_URL)} label={ui.home.settings} />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-primary-text/60">
        {__APP_VERSION__}
      </div>
    </div>
  )
}
