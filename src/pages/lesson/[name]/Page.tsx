import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import LessonSettings from '../../../components/lesson/LessonSettings.tsx'
import type { LessonSave } from '../../../types/config.ts'
import type { Verb } from '../../../types/verb.ts'
import { loadVerbsFromJson } from '../../../utils/jsonVerbsLoader.ts'
import { loadLessonFromLocalStorage } from '../../../utils/localStorage.ts'
import { useToast } from '../../../components/shared/Toast.tsx'

export default function Page() {
  const { name } = useParams<{ name: string }>()
  const [verbs, setVerbs] = useState<Verb[]>([])
  const toast = useToast()

  const lesson = useMemo<LessonSave | null>(() => {
    if (!name) return null
    return loadLessonFromLocalStorage(name)
  }, [name])

  useEffect(() => {
    if (!lesson) {
      setVerbs([])
      return
    }

    const lessonFile =
      (lesson as LessonSave & { config: LessonSave['config'] & { file?: string } }).config.file ??
      lesson.file

    loadVerbsFromJson(lessonFile)
      .then((loadedVerbs) => {
        const lessonVerbIds = new Set(lesson.verbs)
        const filteredVerbs = loadedVerbs.filter((verb) => lessonVerbIds.has(verb.id))
        setVerbs(filteredVerbs)
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : String(err)
        toast.error('Failed to load verbs', errorMessage)
        setVerbs([])
      })
  }, [lesson, toast])

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
