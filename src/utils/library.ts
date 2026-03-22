import { LIBRARY_SAVE_NAME_MAX_LEN, LIBRARY_SAVE_NOTES_MAX_LEN } from '../consts/librarySave.ts'
import type { Language, LessonSave, Library } from '../types/config.ts'
import { getLibraryStorageKey } from '../consts/localStorage.ts'
import { normalizeLessonConfigLevels } from './localStorage.ts'

/** Case- and accent-insensitive order for sorting library entries by `name`. */
const libraryLessonNameOrder = new Intl.Collator(undefined, { sensitivity: 'base' })

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

/** Non-empty trimmed `name` values from library lessons (order preserved). */
export function getLibraryLessonNames(language: Language): string[] {
  const library = loadLibraryFromLocalStorage(language)
  return library.lessons
    .map((l) => l.name?.trim())
    .filter((n): n is string => n != null && n.length > 0)
}

/**
 * Saves a copy of the lesson with `name` and optional `description` to the language library.
 * Replaces any existing entry with the same name (trimmed, case-insensitive) and sorts by name.
 */
export function saveLibraryEntry(
  language: Language,
  lesson: LessonSave,
  name: string,
  description: string,
): void {
  const trimmedName = name.trim().slice(0, LIBRARY_SAVE_NAME_MAX_LEN)
  const trimmedDesc = description.trim().slice(0, LIBRARY_SAVE_NOTES_MAX_LEN)

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
  const newNameKey = trimmedName.toLowerCase()
  const withoutSameName = library.lessons.filter(
    (l) => (l.name?.trim() ?? '').toLowerCase() !== newNameKey,
  )
  const lessons = [...withoutSameName, entry].sort((a, b) =>
    libraryLessonNameOrder.compare(a.name?.trim() ?? '', b.name?.trim() ?? ''),
  )
  saveLibraryToLocalStorage({
    language,
    lessons,
  })
}
