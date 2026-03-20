import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import type {LessonSave} from '../../../types/config.ts'
import type { Verb } from '../../../types/verb.ts'
import { loadVerbsFromJson } from '../../../utils/jsonVerbsLoader.ts'
import {
  LANGUAGE_LABELS,
  POOL_LABELS,
  LEVEL_LABELS,
  DIRECTION_LABELS,
  SPEED_LABELS,
  BATCH_LABELS,
} from '../../../types/config.ts'
import { loadLessonFromLocalStorage } from '../../../utils/localStorage.ts'
import { useToast } from '../../../components/shared/Toast.tsx'

function ConfigDisplayRow({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex w-full items-center gap-2">
      <span className="shrink-0 text-sm text-primary-text">{label}</span>
      <span className="min-w-0 flex-1 truncate text-primary-text">{value}</span>
    </div>
  )
}

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
         <div className="verby-card flex flex-col gap-4 p-4">
          <ConfigDisplayRow
            label="language:"
            value={LANGUAGE_LABELS[lesson.config.language]}
          />
          <ConfigDisplayRow label="pool:" value={POOL_LABELS[lesson.config.pool]} />
          <ConfigDisplayRow label="level:" value={LEVEL_LABELS[lesson.config.level]} />
          <ConfigDisplayRow
            label="directions:"
            value={DIRECTION_LABELS[lesson.config.direction]}
          />
           {lesson.config.directionConjugation !== undefined && <ConfigDisplayRow
            label="direction conjugation:"
            value={lesson.config.directionConjugation}
          />}
           {lesson.config.directionForm !== undefined && <ConfigDisplayRow
            label="direction form:"
            value={lesson.config.directionForm}
          />}
          <ConfigDisplayRow label="speed:" value={SPEED_LABELS[lesson.config.speed]} />
          <ConfigDisplayRow
            label="batch:"
            value={BATCH_LABELS[lesson.config.batch]}
          />
          <ConfigDisplayRow label="verbs loaded:" value={verbs.length} />
        </div>
      </div>
    </div>
  )
}
