import { useMemo } from 'react'
import * as Switch from '@radix-ui/react-switch'

import type { LessonSave } from '../../../types/config.ts'
import type { Verb } from '../../../types/verb.ts'

type VerbViewProps = {
  lesson: LessonSave
  verb: Verb
  onLearntChange: (learnt: boolean) => void
}

export default function VerbView({ lesson, verb, onLearntChange }: VerbViewProps) {
  const { isLearnt, inLesson } = useMemo(() => {
    const index = lesson.verbs.findIndex((id) => id === verb.id)
    return {
      inLesson: index >= 0,
      isLearnt: index >= 0 ? (lesson.learnt[index] ?? false) : false,
    }
  }, [lesson, verb.id])

  if (!inLesson) {
    return <p className="text-sm text-primary-text">This verb is not part of the current lesson.</p>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker p-4">
      <p className="mb-4 text-lg font-semibold">{verb.verb}</p>
      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
        <span>Learnt in this lesson</span>
        <Switch.Root
          checked={isLearnt}
          onCheckedChange={onLearntChange}
          className="relative h-6 w-11 shrink-0 rounded-full bg-primary-darkest transition-colors data-[state=checked]:bg-primary-text"
        >
          <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-[22px]" />
        </Switch.Root>
      </label>
    </div>
  )
}
