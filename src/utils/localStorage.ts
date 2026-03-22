import type { Language, LessonSave } from '../types/config.ts'
import type { MarkedVerb } from '../types/verb.ts'

export const LESSON_STORAGE_KEY_PREFIX = 'lesson-'
const MARKED_VERBS_KEY_SUFFIX = 'marked-verbs'

export function getMarkedVerbsKey(language: Language): string {
  return `${language}-${MARKED_VERBS_KEY_SUFFIX}`
}

function lessonStorageKey(lessonName: string): string {
  return `${LESSON_STORAGE_KEY_PREFIX}${lessonName}`
}

export function saveLessonToLocalStorage(lesson: LessonSave): void {
  const key = lessonStorageKey(lesson.name)
  localStorage.setItem(key, JSON.stringify(lesson))
}

export function loadLessonFromLocalStorage(lessonName: string): LessonSave | null {
  try {
    const key = lessonStorageKey(lessonName)
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as LessonSave
  } catch {
    return null
  }
}

export function removeLessonFromLocalStorage(lessonName: string): void {
  try {
    localStorage.removeItem(lessonStorageKey(lessonName))
  } catch {
    // ignore
  }
}

function parseMarkedVerbs(raw: string): MarkedVerb[] {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (v): v is MarkedVerb =>
        v != null &&
        typeof v === 'object' &&
        typeof (v as MarkedVerb).id === 'number' &&
        typeof (v as MarkedVerb).description === 'string',
    )
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
