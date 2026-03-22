import { useEffect, useMemo, useState } from 'react'

import LessonSettings from './LessonSettings.tsx'
import type { LanguageConfig, LessonSave } from '../../types/config.ts'
import type { Verb } from '../../types/verb.ts'

type LessonTopBarProps = {
  lesson: LessonSave
  verbs: Verb[]
  lastVerbsIds: number[]
  languageConfig: LanguageConfig
  currentVerb?: Verb
  onVerbLearntChange: (verbId: number, learnt: boolean) => void
}

function formatElapsed(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function LessonTopBar({
  lesson,
  verbs,
  lastVerbsIds,
  languageConfig,
  currentVerb,
  onVerbLearntChange,
}: LessonTopBarProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [sameSpeedTurnProgress, setSameSpeedTurnProgress] = useState<{ turn: number; total: number }>({ turn: 1, total: lesson.verbs.length})

  useEffect(() => {
    const id = window.setInterval(() => {
      setElapsedSeconds((n) => n + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const notLearntCount = useMemo(
    () =>
      lesson.verbs.reduce(
        (count, _id, index) => count + (lesson.learnt[index] ? 0 : 1),
        0,
      ),
    [lesson.verbs, lesson.learnt],
  )

  const maxRepeated = useMemo(() => {
    if (lesson.repeated.length === 0) return 0
    return Math.max(...lesson.repeated.map((r) => r ?? 0))
  }, [lesson.repeated])

  const verbsRepeatedMaxRepeatedTimes = useMemo(() => {
    return lesson.repeated.filter(r => r === maxRepeated).length
  }, [maxRepeated, lesson.repeated])

  useEffect(() => {
    if (maxRepeated > sameSpeedTurnProgress.turn) {
      setSameSpeedTurnProgress({
        turn: maxRepeated,
        total: lesson.learnt.filter(l => !l).length
      })
    }
  }, [maxRepeated, sameSpeedTurnProgress, lesson])

  return (
    <header className="flex w-full shrink-0 items-center justify-between gap-3 border-b border-primary-darker bg-primary-darkest px-4 py-2 text-sm text-primary-text">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        <span className="tabular-nums" aria-label="Time since lesson started">
          {formatElapsed(elapsedSeconds)}
        </span>
        {lesson.config.speed === 'same' && sameSpeedTurnProgress ? (
          <span className="text-primary-text/90">
            Turn <span className="tabular-nums font-medium">{maxRepeated}</span>
            <span className="tabular-nums text-primary-text/80">
              {' '}
              ({verbsRepeatedMaxRepeatedTimes}/{sameSpeedTurnProgress.total})
            </span>
          </span>
        ) : null}
        <span className="text-primary-text/90">
          Left{' '}
          <span className="tabular-nums font-medium">{notLearntCount}</span>
          <span className="tabular-nums text-primary-text/80">
            {' '}/ {lesson.verbs.length}
          </span>
        </span>
      </div>
      <div className="shrink-0">
        <LessonSettings
          lesson={lesson}
          verbs={verbs}
          lastVerbsIds={lastVerbsIds}
          languageConfig={languageConfig}
          currentVerb={currentVerb}
          onVerbLearntChange={onVerbLearntChange}
        />
      </div>
    </header>
  )
}
