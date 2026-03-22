import {
  LANGUAGE_LABELS,
  REGULARITY_LABELS,
  LEVEL_LABELS,
  DIRECTION_LABELS,
  SPEED_LABELS,
  BATCH_LABELS, EXTRA_LABELS, type LanguageConfig,
} from '../../../types/config.ts'
import type { LessonSave } from '../../../types/config.ts'

type ConfigSummaryProps = {
  lesson: LessonSave
  languageConfig: LanguageConfig
}

export default function ConfigSummary({ lesson, languageConfig }: ConfigSummaryProps) {
  const conjugationLabel =
    lesson.config.conjugation !== undefined
      ? languageConfig.languageLabels.conjugationsLabels[lesson.config.conjugation]
      : undefined

  const rows: Array<{ label: string; value: string | number }> = [
    { label: 'language', value: LANGUAGE_LABELS[lesson.config.language] },
    {
      label: 'levels',
      value: lesson.config.levels.map((l) => LEVEL_LABELS[l]).join(', '),
    },
    { label: 'direction', value: DIRECTION_LABELS[lesson.config.direction] },
    { label: 'extra', value: EXTRA_LABELS[lesson.config.extra] },
    { label: 'regularity', value: REGULARITY_LABELS[lesson.config.regularity] },
    { label: 'speed', value: SPEED_LABELS[lesson.config.speed] },
    { label: 'batch', value: BATCH_LABELS[lesson.config.batch] },
  ]

  if (lesson.config.conjugation !== undefined) {
    rows.splice(3, 0, {
      label: 'direction conjugation',
      value: conjugationLabel ?? lesson.config.conjugation,
    })
  }

  return (
    <div className="overflow-hidden rounded-lg border border-primary-darkest">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <div className="border-b border-primary-darkest bg-primary-darker/25 px-3 py-2 text-sm font-medium text-primary-text">
              {row.label}
            </div>
            <div className="border-b border-primary-darkest px-3 py-2 text-sm text-primary-text">
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
