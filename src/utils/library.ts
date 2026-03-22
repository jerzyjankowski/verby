import type { Language, LessonSave, Library } from '../types/config.ts'
import { getLibraryStorageKey } from '../consts/localStorage.ts'
import { normalizeLessonConfigLevels } from './localStorage.ts'

function isLessonSaveLike(value: unknown): value is LessonSave {
  return (
    value != null &&
    typeof value === 'object' &&
    'config' in value &&
    typeof (value as LessonSave).config === 'object' &&
    (value as LessonSave).config != null
  )
}

function loadLibraryFromLocalStorage(language: Language): Library {
  try {
    const raw = localStorage.getItem(getLibraryStorageKey(language))
    if (!raw) return { language, lessons: [] }

    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return { language, lessons: [] }

    const lessonsRaw = (parsed as Partial<Library>).lessons
    if (!Array.isArray(lessonsRaw)) return { language, lessons: [] }

    const lessons: LessonSave[] = []
    for (const item of lessonsRaw) {
      if (!isLessonSaveLike(item)) continue
      lessons.push({
        ...item,
        config: normalizeLessonConfigLevels(item.config),
      })
    }

    return { language, lessons }
  } catch {
    return { language, lessons: [] }
  }
}

function saveLibraryToLocalStorage(library: Library): void {
  const key = getLibraryStorageKey(library.language)
  localStorage.setItem(key, JSON.stringify(library))
}

/** Appends a copy of the lesson with `name` and optional `description` to the language library. */
export function saveNewLibraryEntry(
  language: Language,
  lesson: LessonSave,
  name: string,
  description: string,
): void {
  const trimmedName = name.trim()
  const trimmedDesc = description.trim()

  const entry: LessonSave = {
    ...lesson,
    name: trimmedName,
  }
  if (trimmedDesc) {
    entry.description = trimmedDesc
  } else {
    delete entry.description
  }

  const library = loadLibraryFromLocalStorage(language)
  saveLibraryToLocalStorage({
    language,
    lessons: [...library.lessons, entry],
  })
}
