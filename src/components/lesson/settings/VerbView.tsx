import { useEffect, useMemo, useState } from 'react'
import * as Switch from '@radix-ui/react-switch'

import Button from '../../shared/Button.tsx'
import TextField from '../../shared/TextField.tsx'
import type { LessonSave } from '../../../types/config.ts'
import type { MarkedVerb, Verb } from '../../../types/verb.ts'
import { ui } from '../../../locales/index.ts'
import {
  loadMarkedVerbFromLocalStorage,
  removeMarkedVerbFromLocalStorage,
  saveMarkedVerbToLocalStorage,
} from '../../../utils/localStorage.ts'

type VerbViewProps = {
  lesson: LessonSave
  verb: Verb
  onLearntChange: (learnt: boolean) => void
}

function isMarkedDirty(
  markedOn: boolean,
  description: string,
  lastPersisted: MarkedVerb | null,
  verbId: number,
): boolean {
  if (markedOn) {
    if (lastPersisted === null) return true
    return lastPersisted.id !== verbId || lastPersisted.description !== description
  }
  return lastPersisted !== null
}

export default function VerbView({ lesson, verb, onLearntChange }: VerbViewProps) {
  const language = lesson.config.language

  const { isLearnt, inLesson } = useMemo(() => {
    const index = lesson.verbs.findIndex((id) => id === verb.id)
    return {
      inLesson: index >= 0,
      isLearnt: index >= 0 ? (lesson.learnt[index] ?? false) : false,
    }
  }, [lesson, verb.id])

  const [markedOn, setMarkedOn] = useState(false)
  const [description, setDescription] = useState('')
  const [lastPersisted, setLastPersisted] = useState<MarkedVerb | null>(null)

  useEffect(() => {
    const stored = loadMarkedVerbFromLocalStorage(language, verb.id)
    if (stored) {
      setMarkedOn(true)
      setDescription(stored.description)
      setLastPersisted(stored)
    } else {
      setMarkedOn(false)
      setDescription('')
      setLastPersisted(null)
    }
  }, [language, verb.id])

  const dirty = isMarkedDirty(markedOn, description, lastPersisted, verb.id)

  const handleSaveMarked = () => {
    if (markedOn) {
      const next = { id: verb.id, description: description.trim() }
      saveMarkedVerbToLocalStorage(language, next)
      setLastPersisted(next)
    } else {
      removeMarkedVerbFromLocalStorage(language, verb.id)
      setLastPersisted(null)
      setDescription('')
    }
  }

  if (!inLesson) {
    return <p className="text-sm text-primary-text">This verb is not part of the current lesson.</p>
  }

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker p-4">
      <p className="text-lg font-semibold">{verb.verb}</p>
      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
        <span>{ui.verbView.learntInLesson}</span>
        <Switch.Root
          checked={isLearnt}
          onCheckedChange={onLearntChange}
          className="relative h-6 w-11 shrink-0 rounded-full bg-primary-darkest transition-colors data-[state=checked]:bg-primary-text"
        >
          <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-[22px]" />
        </Switch.Root>
      </label>

      <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
        <span>{ui.verbView.marked}</span>
        <Switch.Root
          checked={markedOn}
          onCheckedChange={setMarkedOn}
          className="relative h-6 w-11 shrink-0 rounded-full bg-primary-darkest transition-colors data-[state=checked]:bg-primary-text"
        >
          <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-[22px]" />
        </Switch.Root>
      </label>

      {markedOn ? (
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          <TextField
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={ui.verbView.reasonPlaceholder}
          />
        </label>
      ) : null}

      {dirty ? (
        <Button
          label={ui.common.save}
          onClick={handleSaveMarked}
          main
          disabled={(markedOn && !description) || description.trim().length === 0}
        />
      ) : null}
    </div>
  )
}
