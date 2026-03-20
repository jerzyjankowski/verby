import { useParams } from 'react-router-dom'

import LessonSettings from '../../../components/lesson/LessonSettings.tsx'
import { useLesson } from '../../../hooks/useLesson.ts'

export default function Page() {
  const { name } = useParams<{ name: string }>()
  const { lesson, verbs, round } = useLesson(name)

  console.log('[JJ]verbs:', verbs)
  console.log('[JJ]lesson:', lesson)
  console.log('[JJ]round:', round)

  if (!lesson) {
    return (
      <div className="min-h-screen bg-primary text-primary-text p-4">
        <p className="text-primary-text">
          No config found for lesson "{name ?? 'unknown'}". Start from the init page.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary text-primary-text p-4">
      <div className="mx-auto max-w-2xl">
        <LessonSettings lesson={lesson} verbsCount={verbs.length} />
      </div>
    </div>
  )
}
