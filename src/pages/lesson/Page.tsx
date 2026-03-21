import { useState } from 'react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

import Button from '../../components/shared/Button.tsx'
import Dropdown from '../../components/shared/Dropdown.tsx'
import type { DropdownItem } from '../../components/shared/types.ts'
import {
  type LessonConfig,
  type LessonConfigFormState,
  LANGUAGE_OPTIONS,
  LANGUAGE_LABELS,
  REGULARITY_OPTIONS,
  REGULARITY_LABELS,
  LEVEL_OPTIONS,
  LEVEL_LABELS,
  DIRECTION_OPTIONS,
  DIRECTION_LABELS,
  SPEED_OPTIONS,
  SPEED_LABELS,
  BATCH_OPTIONS,
  BATCH_LABELS, EXTRA_OPTIONS, EXTRA_LABELS,
} from '../../types/config.ts'
import { spanishConfig } from '../../configs/esp.ts'
import { initLesson } from '../../utils/initLesson.ts'
import { loadLessonFromLocalStorage } from '../../utils/localStorage.ts'

function ConfigRow({
  label,
  value,
  options,
  labelMap,
  onSelect,
}: {
  label: string
  value: string | number | undefined
  options: readonly (string | number)[]
  labelMap: Record<string, string>
  onSelect: (key: string) => void
}) {
  const displayValue = value !== undefined ? labelMap[String(value)] : undefined
  const items: DropdownItem[] = options.map((opt) => ({
    key: String(opt),
    label: labelMap[String(opt)],
    onSelect: () => onSelect(String(opt)),
  }))

  return (
    <>
      <span className="text-sm text-primary-text">{label}</span>
      <div className="min-w-0">
        <Dropdown
          trigger={
            <button
              type="button"
              className="w-full min-w-0 truncate text-left cursor-pointer rounded-lg border border-primary-darkest bg-primary px-3 py-2 text-primary-text transition-colors hover:bg-primary-darker focus:bg-primary-darker"
            >
              {displayValue ?? 'Select…'}
            </button>
          }
          items={items}
          align="start"
        />
      </div>
    </>
  )
}

export default function Page() {
  const navigate = useNavigate()
  const [isStarting, setIsStarting] = useState(false)
  const [form, setForm] = useState<LessonConfigFormState>(() => {
    const savedLesson = loadLessonFromLocalStorage('_new')
    return savedLesson?.config ?? {}
  })
  const conjugationOptions = spanishConfig.conjugationsLabels.map((_, idx) => idx)
  const conjugationLabelMap: Record<string, string> =
    Object.fromEntries(spanishConfig.conjugationsLabels.map((label, idx) => [String(idx), label]))

  const setLanguage = (v: string) =>
    setForm((prev) => ({ ...prev, language: v as LessonConfig['language'] }))
  const setRegularity = (v: string) =>
    setForm((prev) => ({ ...prev, regularity: v as LessonConfig['regularity'] }))
  const setLevel = (v: string) =>
    setForm((prev) => ({ ...prev, level: v as LessonConfig['level'] }))
  const setDirection = (v: string) =>
    setForm((prev) => ({ ...prev, direction: v as LessonConfig['direction'] }))
  const setExtra = (v: string) =>
    setForm((prev) => ({
      ...prev,
      extra: v as LessonConfig['extra'],
      directionConjugation: v === 'conjugation' ? prev.directionConjugation : undefined,
    }))
  const setDirectionConjugation = (v: string) =>
    setForm((prev) => ({ ...prev, directionConjugation: Number(v) }))
  const setSpeed = (v: string) =>
    setForm((prev) => ({ ...prev, speed: v as LessonConfig['speed'] }))
  const setBatch = (v: string) =>
    setForm((prev) => ({
      ...prev,
      batch: (v === 'ALL' ? 'ALL' : Number(v)) as LessonConfig['batch'],
    }))

  const allSelected =
    form.language &&
    form.regularity &&
    form.level &&
    form.direction &&
    form.extra &&
    (form.extra !== 'conjugation' || form.directionConjugation !== undefined) &&
    form.speed &&
    form.batch !== undefined

  const handleStart = async () => {
    if (!allSelected || isStarting) return
    const config: LessonConfig = {
      language: form.language!,
      regularity: form.regularity!,
      level: form.level!,
      direction: form.direction!,
      extra: form.extra!,
      directionConjugation: form.extra === 'conjugation' ? form.directionConjugation : undefined,
      speed: form.speed!,
      batch: form.batch!,
    }
    try {
      setIsStarting(true)
      await initLesson(config)
      navigate('/lesson/_new')
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary text-primary-text p-4">
      <div className="mx-auto max-w-2xl">
        <div className="verby-card grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4 p-4 bg-primary-darkest">
          <ConfigRow
            label="language:"
            value={form.language}
            options={LANGUAGE_OPTIONS}
            labelMap={LANGUAGE_LABELS as Record<string, string>}
            onSelect={setLanguage}
          />
          <ConfigRow
            label="direction:"
            value={form.direction}
            options={DIRECTION_OPTIONS}
            labelMap={DIRECTION_LABELS as Record<string, string>}
            onSelect={setDirection}
          />
          <ConfigRow
            label="extra:"
            value={form.extra}
            options={EXTRA_OPTIONS}
            labelMap={EXTRA_LABELS as Record<string, string>}
            onSelect={setExtra}
          />
          {form.extra === 'conjugation' && (
            <ConfigRow
              label="conjugation:"
              value={form.directionConjugation}
              options={conjugationOptions}
              labelMap={conjugationLabelMap}
              onSelect={setDirectionConjugation}
            />
          )}
          <ConfigRow
            label="level:"
            value={form.level}
            options={LEVEL_OPTIONS}
            labelMap={LEVEL_LABELS as Record<string, string>}
            onSelect={setLevel}
          />
          <ConfigRow
            label="regularity:"
            value={form.regularity}
            options={REGULARITY_OPTIONS}
            labelMap={REGULARITY_LABELS as Record<string, string>}
            onSelect={setRegularity}
          />
          <ConfigRow
            label="speed:"
            value={form.speed}
            options={SPEED_OPTIONS}
            labelMap={SPEED_LABELS as Record<string, string>}
            onSelect={setSpeed}
          />
          <ConfigRow
            label="batch:"
            value={form.batch}
            options={BATCH_OPTIONS}
            labelMap={BATCH_LABELS as Record<string, string>}
            onSelect={setBatch}
          />

          <div className="col-span-2 mt-4 flex items-center gap-3">
            <Button onClick={() => navigate('/')} label="Back" icon={<ArrowLeftIcon className="size-4" />} fullWidth={false} />
            <Button onClick={handleStart} disabled={!allSelected || isStarting} label={isStarting ? 'Starting...' : 'Start'} main />
          </div>
        </div>
      </div>
    </div>
  )
}
