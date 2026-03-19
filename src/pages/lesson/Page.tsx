import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Dropdown from '../../components/shared/Dropdown.tsx'
import type { DropdownItem } from '../../components/shared/types.ts'
import {
  type LessonConfig,
  type LessonConfigFormState,
  LANGUAGE_OPTIONS,
  LANGUAGE_LABELS,
  POOL_OPTIONS,
  POOL_LABELS,
  LEVEL_OPTIONS,
  LEVEL_LABELS,
  DIRECTION_OPTIONS,
  DIRECTION_LABELS,
  SPEED_OPTIONS,
  SPEED_LABELS,
  BATCH_OPTIONS,
  BATCH_LABELS,
} from '../../types/config.ts'
import { spanishConfig } from '../../configs/esp.ts'
import {initLesson} from "../../utils/initLesson.ts";
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
  const [form, setForm] = useState<LessonConfigFormState>(() => {
    const savedLesson = loadLessonFromLocalStorage('_new')
    return savedLesson?.config ?? {}
  })
  const conjugationOptions = spanishConfig.irregularConjugationsLabels.map((_, idx) => idx)
  const formOptions = spanishConfig.irregularFormsLabels.map((_, idx) => idx)
  const conjugationLabelMap: Record<string, string> =
    Object.fromEntries(spanishConfig.irregularConjugationsLabels.map((label, idx) => [String(idx), label]))
  const formLabelMap: Record<string, string> =
    Object.fromEntries(spanishConfig.irregularFormsLabels.map((label, idx) => [String(idx), label]))

  const setLanguage = (v: string) =>
    setForm((prev) => ({ ...prev, language: v as LessonConfig['language'] }))
  const setPool = (v: string) =>
    setForm((prev) => ({ ...prev, pool: v as LessonConfig['pool'] }))
  const setLevel = (v: string) =>
    setForm((prev) => ({ ...prev, level: v as LessonConfig['level'] }))
  const setDirection = (v: string) =>
    setForm((prev) => ({
      ...prev,
      direction: v as LessonConfig['direction'],
      directionConjugation: v === 'conjugation' ? prev.directionConjugation : undefined,
      directionForm: v === 'form' ? prev.directionForm : undefined,
    }))
  const setDirectionConjugation = (v: string) =>
    setForm((prev) => ({ ...prev, directionConjugation: Number(v) }))
  const setDirectionForm = (v: string) =>
    setForm((prev) => ({ ...prev, directionForm: Number(v) }))
  const setSpeed = (v: string) =>
    setForm((prev) => ({ ...prev, speed: v as LessonConfig['speed'] }))
  const setBatch = (v: string) =>
    setForm((prev) => ({
      ...prev,
      batch: (v === 'ALL' ? 'ALL' : Number(v)) as LessonConfig['batch'],
    }))

  const allSelected =
    form.language &&
    form.pool &&
    form.level &&
    form.direction &&
    (form.direction !== 'conjugation' || form.directionConjugation !== undefined) &&
    (form.direction !== 'form' || form.directionForm !== undefined) &&
    form.speed &&
    form.batch !== undefined

  const handleStart = () => {
    if (!allSelected) return
    const config: LessonConfig = {
      language: form.language!,
      pool: form.pool!,
      level: form.level!,
      direction: form.direction!,
      directionConjugation: form.direction === 'conjugation' ? form.directionConjugation : undefined,
      directionForm: form.direction === 'form' ? form.directionForm : undefined,
      speed: form.speed!,
      batch: form.batch!,
    }
    initLesson(config)
    navigate('/lesson/_new')
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
            label="pool:"
            value={form.pool}
            options={POOL_OPTIONS}
            labelMap={POOL_LABELS as Record<string, string>}
            onSelect={setPool}
          />
          <ConfigRow
            label="level:"
            value={form.level}
            options={LEVEL_OPTIONS}
            labelMap={LEVEL_LABELS as Record<string, string>}
            onSelect={setLevel}
          />
          <ConfigRow
            label="directions:"
            value={form.direction}
            options={DIRECTION_OPTIONS}
            labelMap={DIRECTION_LABELS as Record<string, string>}
            onSelect={setDirection}
          />
          {form.direction === 'conjugation' && (
            <ConfigRow
              label="conjugation:"
              value={form.directionConjugation}
              options={conjugationOptions}
              labelMap={conjugationLabelMap}
              onSelect={setDirectionConjugation}
            />
          )}
          {form.direction === 'form' && (
            <ConfigRow
              label="form:"
              value={form.directionForm}
              options={formOptions}
              labelMap={formLabelMap}
              onSelect={setDirectionForm}
            />
          )}
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

          <div className="col-span-2 mt-4">
            <button
              type="button"
              onClick={handleStart}
              disabled={!allSelected}
              className="verby-button w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-darker"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
