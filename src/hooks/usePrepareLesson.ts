import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getLanguageConfig } from '../configs/languageConfigMap.ts'
import {
  BATCH_OPTIONS,
  BATCH_LABELS,
  DIRECTION_OPTIONS,
  DIRECTION_LABELS,
  EXTRA_OPTIONS,
  EXTRA_LABELS,
  LANGUAGE_OPTIONS,
  LANGUAGE_LABELS,
  LEVEL_OPTIONS,
  LEVEL_LABELS,
  REGULARITY_OPTIONS,
  REGULARITY_LABELS,
  SPEED_OPTIONS,
  SPEED_LABELS,
  type Extra,
  type LanguageConfig,
  type LessonConfig,
  type LessonConfigFormState,
  type LessonSave,
  type Level,
} from '../types/config.ts'
import type { Verb, VerbLevel } from '../types/verb.ts'
import { initLesson } from '../utils/initLesson.ts'
import { loadVerbsFromJson } from '../utils/jsonVerbsLoader.ts'
import {
  loadCurrentLessonFromLocalStorage,
  saveLessonAsCurrentToLocalStorage,
} from '../utils/localStorage.ts'
import { LESSON_PAGE_URL } from '../consts/urls.ts'

const LEVELS_FROM_VERB_DATA_FIELDS: ReadonlySet<VerbLevel> = new Set([
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
])

/** MAIN / A0 always; A1–C1 only if at least one verb uses that `level` value. */
function availableLevelsForVerbs(verbs: Verb[]): Level[] {
  const present = new Set<Level>()
  for (const v of verbs) {
    if (LEVELS_FROM_VERB_DATA_FIELDS.has(v.level)) {
      present.add(v.level as Level)
    }
  }
  return LEVEL_OPTIONS.filter(
    (l) => l === 'MAIN' || l === 'A0' || present.has(l),
  )
}

export type PrepareLessonPendingStart = {
  lesson: LessonSave
  availableVerbCountBeforeBatch: number
  batch: LessonConfig['batch']
}

export type UsePrepareLessonLabels = {
  language: Record<string, string>
  level: Record<string, string>
  direction: Record<string, string>
  extra: Record<string, string>
  regularity: Record<string, string>
  speed: Record<string, string>
  batch: Record<string, string>
  conjugation: Record<string, string>
}

export type UsePrepareLessonOptions = {
  language: readonly LanguageConfig['code'][]
  level: readonly Level[]
  direction: readonly LessonConfig['direction'][]
  extra: readonly Extra[]
  regularity: readonly LessonConfig['regularity'][]
  speed: readonly LessonConfig['speed'][]
  batch: readonly LessonConfig['batch'][]
  conjugation: readonly number[]
}

export function usePrepareLesson() {
  const navigate = useNavigate()

  const [form, setForm] = useState<LessonConfigFormState>(() => {
    const savedLesson = loadCurrentLessonFromLocalStorage()
    return savedLesson?.config ?? {}
  })

  const [isStarting, setIsStarting] = useState(false)
  const [startConfirmOpen, setStartConfirmOpen] = useState(false)
  const [pendingStart, setPendingStart] = useState<PrepareLessonPendingStart | null>(null)
  const [availableLevelOptions, setAvailableLevelOptions] = useState<Level[]>(LEVEL_OPTIONS)
  /** When this matches `form.language`, `availableLevelOptions` reflects that language's verb data. */
  const [levelsResolvedForLanguage, setLevelsResolvedForLanguage] = useState<
    LessonConfig['language'] | undefined
  >(undefined)

  const languageConfig = useMemo(() => getLanguageConfig(form.language), [form.language])

  const hasExtraChoices =
    languageConfig.languageLabels.conjugationsLabels.length > 0 ||
    languageConfig.languageLabels.formsLabels.length > 0

  const extraOptions = useMemo((): Extra[] => {
    const { conjugationsLabels, formsLabels } = languageConfig.languageLabels
    return EXTRA_OPTIONS.filter((opt) => {
      if (opt === 'conjugation') return conjugationsLabels.length > 0
      if (opt === 'forms') return formsLabels.length > 0
      return true
    })
  }, [
    languageConfig.languageLabels.conjugationsLabels.length,
    languageConfig.languageLabels.formsLabels.length,
  ])

  useEffect(() => {
    if (!hasExtraChoices) {
      setForm((prev) => {
        if (
          prev.extra === 'no' &&
          prev.conjugation === undefined &&
          prev.regularity === 'all'
        ) {
          return prev
        }
        return { ...prev, extra: 'no', conjugation: undefined, regularity: 'all' }
      })
      return
    }
    if (form.extra === undefined) return
    if (!extraOptions.includes(form.extra)) {
      setForm((prev) => ({
        ...prev,
        extra: 'no',
        conjugation: undefined,
        regularity: 'all',
      }))
    }
  }, [extraOptions, form.extra, hasExtraChoices])

  const conjugationLabels = languageConfig.languageLabels.conjugationsLabels
  const conjugationOptions = useMemo(
    () => conjugationLabels.map((_, idx) => idx),
    [conjugationLabels],
  )
  const conjugationLabelMap: Record<string, string> = useMemo(
    () =>
      Object.fromEntries(conjugationLabels.map((label, idx) => [String(idx), label])),
    [conjugationLabels],
  )

  const setLanguage = (v: string) =>
    setForm((prev) => ({
      ...prev,
      language: v as LessonConfig['language'],
      conjugation: undefined,
    }))
  const toggleLevel = (v: string) => {
    const level = v as Level
    setForm((prev) => {
      const cur = prev.levels ?? []
      const has = cur.includes(level)
      const next = has ? cur.filter((x) => x !== level) : [...cur, level]
      return { ...prev, levels: next }
    })
  }
  const setDirection = (v: string) =>
    setForm((prev) => ({ ...prev, direction: v as LessonConfig['direction'] }))
  const setExtra = (v: string) =>
    setForm((prev) => ({
      ...prev,
      extra: v as LessonConfig['extra'],
      conjugation: v === 'conjugation' ? prev.conjugation : undefined,
      regularity: v === 'no' ? 'all' : prev.regularity,
    }))
  const setConjugation = (v: string) =>
    setForm((prev) => ({ ...prev, conjugation: Number(v) }))
  const setRegularity = (v: string) =>
    setForm((prev) => ({ ...prev, regularity: v as LessonConfig['regularity'] }))
  const setSpeed = (v: string) =>
    setForm((prev) => ({ ...prev, speed: v as LessonConfig['speed'] }))
  const setBatch = (v: string) =>
    setForm((prev) => ({
      ...prev,
      batch: (v === 'ALL' ? 'ALL' : Number(v)) as LessonConfig['batch'],
    }))

  useEffect(() => {
    if (!form.language) {
      setAvailableLevelOptions(LEVEL_OPTIONS)
      setLevelsResolvedForLanguage(undefined)
      return
    }
    const lang = form.language
    const cfg = getLanguageConfig(lang)
    if (!cfg.verbsFilePath) {
      setAvailableLevelOptions(LEVEL_OPTIONS)
      setLevelsResolvedForLanguage(undefined)
      return
    }

    const alwaysOnly: Level[] = ['MAIN', 'A0']
    setAvailableLevelOptions(alwaysOnly)
    setLevelsResolvedForLanguage(undefined)

    let cancelled = false
    ;(async () => {
      try {
        const verbs: Verb[] = await loadVerbsFromJson(cfg.verbsFilePath)
        if (cancelled) return
        setAvailableLevelOptions(availableLevelsForVerbs(verbs))
        setLevelsResolvedForLanguage(lang)
      } catch {
        if (!cancelled) {
          setAvailableLevelOptions(alwaysOnly)
          setLevelsResolvedForLanguage(lang)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [form.language])

  useEffect(() => {
    if (form.levels === undefined || form.levels.length === 0) return
    if (levelsResolvedForLanguage !== form.language) return
    const valid = form.levels.filter((l) => availableLevelOptions.includes(l))
    if (valid.length === form.levels.length) return
    const fallback =
      valid.length > 0 ? valid : [availableLevelOptions[0] ?? 'MAIN']
    setForm((prev) => ({ ...prev, levels: fallback }))
  }, [availableLevelOptions, form.levels, form.language, levelsResolvedForLanguage])

  const allSelected = Boolean(
    form.language &&
      form.levels &&
      form.levels.length > 0 &&
      form.direction &&
      form.speed &&
      form.batch !== undefined &&
      (hasExtraChoices
        ? form.extra &&
          (form.extra !== 'conjugation' || form.conjugation !== undefined) &&
          (form.extra === 'no' || form.regularity !== undefined)
        : true),
  )

  const lessonConfig = useMemo((): LessonConfig | null => {
    if (!allSelected) return null
    const extraForLesson: Extra = hasExtraChoices ? form.extra! : 'no'
    return {
      language: form.language!,
      levels: form.levels!,
      direction: form.direction!,
      extra: extraForLesson,
      regularity: extraForLesson === 'no' ? 'all' : form.regularity!,
      conjugation: extraForLesson === 'conjugation' ? form.conjugation : undefined,
      speed: form.speed!,
      batch: form.batch!,
    }
  }, [
    allSelected,
    hasExtraChoices,
    form.language,
    form.levels,
    form.direction,
    form.extra,
    form.regularity,
    form.conjugation,
    form.speed,
    form.batch,
  ])

  const startDisabled = !lessonConfig || isStarting

  const options: UsePrepareLessonOptions = useMemo(
    () => ({
      language: LANGUAGE_OPTIONS,
      level: availableLevelOptions,
      direction: DIRECTION_OPTIONS,
      extra: extraOptions,
      regularity: REGULARITY_OPTIONS,
      speed: SPEED_OPTIONS,
      batch: BATCH_OPTIONS,
      conjugation: conjugationOptions,
    }),
    [availableLevelOptions, extraOptions, conjugationOptions],
  )

  const labels: UsePrepareLessonLabels = useMemo(
    () => ({
      language: LANGUAGE_LABELS as Record<string, string>,
      level: LEVEL_LABELS as Record<string, string>,
      direction: DIRECTION_LABELS as Record<string, string>,
      extra: EXTRA_LABELS as Record<string, string>,
      regularity: REGULARITY_LABELS as Record<string, string>,
      speed: SPEED_LABELS as Record<string, string>,
      batch: BATCH_LABELS as Record<string, string>,
      conjugation: conjugationLabelMap,
    }),
    [conjugationLabelMap],
  )

  const handleStart = async () => {
    if (!lessonConfig || isStarting) return
    try {
      setIsStarting(true)
      const { lesson, availableVerbCountBeforeBatch } = await initLesson(
        lessonConfig,
        languageConfig,
      )
      setPendingStart({
        lesson,
        availableVerbCountBeforeBatch,
        batch: lessonConfig.batch,
      })
      setStartConfirmOpen(true)
    } finally {
      setIsStarting(false)
    }
  }

  const handleStartConfirmOpenChange = (open: boolean) => {
    setStartConfirmOpen(open)
    if (!open) setPendingStart(null)
  }

  const confirmStartLesson = () => {
    if (!pendingStart || pendingStart.lesson.verbs.length === 0) return
    saveLessonAsCurrentToLocalStorage(pendingStart.lesson)
    setPendingStart(null)
    setStartConfirmOpen(false)
    navigate(LESSON_PAGE_URL)
  }

  const cancelStartLesson = () => {
    setStartConfirmOpen(false)
    setPendingStart(null)
  }

  return {
    form,
    languageConfig,
    hasExtraChoices,
    lessonConfig,
    allSelected,
    startDisabled,
    options,
    labels,
    setLanguage,
    toggleLevel,
    setDirection,
    setExtra,
    setConjugation,
    setRegularity,
    setSpeed,
    setBatch,
    isStarting,
    pendingStart,
    startConfirmOpen,
    handleStart,
    handleStartConfirmOpenChange,
    confirmStartLesson,
    cancelStartLesson,
  }
}
