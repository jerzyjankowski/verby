import type { LessonConfig } from '../types/config'

export const LESSON_STORAGE_KEY_PREFIX = 'lesson-'

function lessonStorageKey(lessonName: string): string {
  return `${LESSON_STORAGE_KEY_PREFIX}${lessonName}`
}

export function saveLessonToLocalStorage(lesson: LessonConfig): void {
  const key = lessonStorageKey(lesson.name)
  localStorage.setItem(key, JSON.stringify(lesson))
}

export function loadLessonFromLocalStorage(lessonName: string): LessonConfig | null {
  try {
    const key = lessonStorageKey(lessonName)
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as LessonConfig
  } catch {
    return null
  }
}
