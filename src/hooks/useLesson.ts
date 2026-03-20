import { useEffect, useMemo, useState } from 'react'

import { useToast } from '../components/shared/Toast.tsx'
import type { LessonSave } from '../types/config.ts'
import type { Verb } from '../types/verb.ts'
import { loadVerbsFromJson } from '../utils/jsonVerbsLoader.ts'
import { loadLessonFromLocalStorage } from '../utils/localStorage.ts'

export function useLesson(name?: string) {
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

  return { lesson, verbs }
}
