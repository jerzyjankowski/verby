import type { Language, LessonSave, Level } from '../types/config.ts'
import { LEVEL_OPTIONS } from '../types/config.ts'
import type { MarkedVerb } from '../types/verb.ts'

function isLevel(value: string): value is Level {
  return LEVEL_OPTIONS.includes(value as Level)
}

/** Migrate legacy `level` string (or invalid data) to `Level[]`. */
function normalizeLessonConfigLevels(config: LessonSave['config']): LessonSave['config'] {
  const raw = config.level as unknown
  if (raw === 'ALL') {
    return { ...config, level: ['MAIN'] }
  }
  if (Array.isArray(raw)) {
    const seen = new Set<Level>()
    const level: Level[] = []
    for (const x of raw) {
      if (typeof x === 'string' && isLevel(x) && !seen.has(x)) {
        seen.add(x)
        level.push(x)
      }
    }
    return level.length > 0 ? { ...config, level } : { ...config, level: ['MAIN'] }
  }
  if (typeof raw === 'string' && isLevel(raw)) {
    return { ...config, level: [raw] }
  }
  return { ...config, level: ['MAIN'] }
}

export const CURRENT_LESSON_STORAGE_KEY = 'current-lesson'
const MARKED_VERBS_KEY_SUFFIX = 'marked-verbs'

export function getMarkedVerbsKey(language: Language): string {
  return `${language}-${MARKED_VERBS_KEY_SUFFIX}`
}

export function saveLessonAsCurrentToLocalStorage(lesson: LessonSave): void {
  localStorage.setItem(CURRENT_LESSON_STORAGE_KEY, JSON.stringify(lesson))
}

export function loadCurrentLessonFromLocalStorage(): LessonSave | null {
  try {
    const raw = localStorage.getItem(CURRENT_LESSON_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LessonSave
    if (parsed?.config) {
      return { ...parsed, config: normalizeLessonConfigLevels(parsed.config) }
    }
    return parsed
  } catch {
    return null
  }
}

function parseMarkedVerbs(raw: string): MarkedVerb[] {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((v): v is MarkedVerb => v != null && typeof v === 'object')
  } catch {
    return []
  }
}

export function loadMarkedVerbsFromLocalStorage(language: Language): MarkedVerb[] {
  try {
    const key = getMarkedVerbsKey(language)
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return parseMarkedVerbs(raw)
  } catch {
    return []
  }
}

export function saveMarkedVerbsToLocalStorage(language: Language, verbs: MarkedVerb[]): void {
  const key = getMarkedVerbsKey(language)
  localStorage.setItem(key, JSON.stringify(verbs))
}

export function loadMarkedVerbFromLocalStorage(
  language: Language,
  verbId: number,
): MarkedVerb | null {
  const found = loadMarkedVerbsFromLocalStorage(language).find((v) => v.id === verbId)
  return found ?? null
}

export function saveMarkedVerbToLocalStorage(language: Language, marked: MarkedVerb): void {
  const all = loadMarkedVerbsFromLocalStorage(language)
  const idx = all.findIndex((v) => v.id === marked.id)
  const next =
    idx >= 0 ? [...all.slice(0, idx), marked, ...all.slice(idx + 1)] : [...all, marked]
  saveMarkedVerbsToLocalStorage(language, next)
}

export function removeMarkedVerbFromLocalStorage(language: Language, verbId: number): void {
  const next = loadMarkedVerbsFromLocalStorage(language).filter((v) => v.id !== verbId)
  saveMarkedVerbsToLocalStorage(language, next)
}
