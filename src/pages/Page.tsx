import { useNavigate } from 'react-router-dom'

import Button from '../components/shared/Button.tsx'
import { loadLessonFromLocalStorage } from '../utils/localStorage.ts'

export default function Page() {
  const navigate = useNavigate()
  const hasNewLessonToContinue = !!loadLessonFromLocalStorage('_new')

  return (
    <div className="min-h-screen bg-primary text-primary-text p-4">
      <div className="mx-auto max-w-2xl">
        <div className="verby-card bg-primary-darkest p-4 flex flex-col gap-3">
          {hasNewLessonToContinue ? (
            <Button onClick={() => navigate('/lesson/_new')} label="Continue" />
          ) : null}
          <Button onClick={() => navigate('/lesson')} label="New Lesson" />
          <Button onClick={() => navigate('/marked-verbs')} label="Marked Verbs" />
        </div>
      </div>
    </div>
  )
}
