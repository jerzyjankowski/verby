import { useEffect, useMemo } from 'react'

import type {LessonConfig} from '../types/config'
import { loadVerbsFromJson } from '../utils/jsonVerbsLoader'
import {
  LANGUAGE_LABELS,
  POOL_LABELS,
  LEVEL_LABELS,
  DIRECTION_LABELS,
  SPEED_LABELS,
  BATCH_LABELS,
} from '../types/config'
import {loadLessonFromLocalStorage} from "../utils/localStorage.ts";

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

export default function LessonPage() {
  useEffect(() => {
    loadVerbsFromJson('/data/esp/verbs-demo.json')
      .then((verbs) => console.log('[JJ]', verbs))
      .catch((err) => console.error('[JJ]Failed to load verbs:', err))
  }, [])

  const lessonConfig = useMemo<LessonConfig | null>(() => {
    return loadLessonFromLocalStorage('_new')
  }, [])

  if (!lessonConfig) {
    return (
      <div className="min-h-screen bg-primary text-primary-text p-4">
        <p className="text-primary-text">No config found. Start from the init page.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary text-primary-text p-4">
      <div className="mx-auto max-w-2xl">
        <div className="verby-card flex flex-col gap-4 p-4">
          <ConfigDisplayRow
            label="language:"
            value={LANGUAGE_LABELS[lessonConfig.config.language]}
          />
          <ConfigDisplayRow label="pool:" value={POOL_LABELS[lessonConfig.config.pool]} />
          <ConfigDisplayRow label="level:" value={LEVEL_LABELS[lessonConfig.config.level]} />
          <ConfigDisplayRow
            label="directions:"
            value={DIRECTION_LABELS[lessonConfig.config.direction]}
          />
          <ConfigDisplayRow label="speed:" value={SPEED_LABELS[lessonConfig.config.speed]} />
          <ConfigDisplayRow
            label="batch:"
            value={BATCH_LABELS[lessonConfig.config.batch]}
          />
        </div>
      </div>
    </div>
  )
}
