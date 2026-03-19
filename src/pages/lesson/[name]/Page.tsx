import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import type {LessonSave} from '../../../types/config.ts'
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
import {conjugate, getCorrectForm, spanishConfig} from '../../../configs/esp.ts'

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

  useEffect(() => {
    loadVerbsFromJson('/data/esp/verbs-demo.json')
      .then((verbs) => {
        // console.log('[JJ]', verbs)
        // for (let i = 0; i < spanishConfig.irregularConjugationsLabels.length; i++) {
        //   console.log('[JJ]', i, spanishConfig.irregularConjugationsLabels[i], JSON.stringify(conjugate(verbs[3], i), null, 2))
        // }
        // for (let i = 0; i < spanishConfig.irregularFormsLabels.length; i++) {
        //   console.log('[JJ]', i, spanishConfig.irregularFormsLabels[i], JSON.stringify(getCorrectForm(verbs[3], i), null, 2))
        // }
      })
      .catch((err) => console.error('[JJ]Failed to load verbs:', err))
  }, [])

  const lesson = useMemo<LessonSave | null>(() => {
    if (!name) return null
    return loadLessonFromLocalStorage(name)
  }, [name])

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
        </div>
      </div>
    </div>
  )
}
