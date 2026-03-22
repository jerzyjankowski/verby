import {
  BATCH_LABELS,
  DIRECTION_LABELS,
  EXTRA_LABELS,
  LANGUAGE_LABELS,
  LEVEL_LABELS,
  REGULARITY_LABELS,
  SPEED_LABELS,
  ui,
} from '../../../locales/index.ts'
import type { LanguageConfig } from '../../../types/config.ts'
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

  const sourceName =
    lesson.name != null && lesson.name.trim() !== ''
      ? lesson.name.trim()
      : ui.configSummary.allVerbsSource

  const rows: Array<{ label: string; value: string | number }> = [
    { label: ui.configSummary.rowLanguage, value: LANGUAGE_LABELS[lesson.config.language] },
    { label: ui.configSummary.rowSource, value: sourceName },
    {
      label: ui.configSummary.rowLevels,
      value: lesson.config.levels.map((l) => LEVEL_LABELS[l]).join(', '),
    },
    { label: ui.configSummary.rowDirection, value: DIRECTION_LABELS[lesson.config.direction] },
    { label: ui.configSummary.rowExtra, value: EXTRA_LABELS[lesson.config.extra] },
    { label: ui.configSummary.rowRegularity, value: REGULARITY_LABELS[lesson.config.regularity] },
    { label: ui.configSummary.rowSpeed, value: SPEED_LABELS[lesson.config.speed] },
    { label: ui.configSummary.rowBatch, value: BATCH_LABELS[lesson.config.batch] },
  ]

  if (lesson.config.conjugation !== undefined) {
    rows.splice(3, 0, {
      label: ui.configSummary.rowDirectionConjugation,
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
