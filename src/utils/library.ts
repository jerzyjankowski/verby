import {
  LIBRARY_SAVE_NAME_MAX_LEN,
  LIBRARY_SAVE_NOTES_MAX_LEN,
  LIBRARY_VERB_SCOPE_LABELS,
  LIBRARY_VERB_SCOPE_OPTIONS,
  type LibraryVerbScope,
} from '../consts/librarySave.ts'
import type { Language, LessonSave, Library } from '../types/config.ts'
import { getLibraryStorageKey } from '../consts/localStorage.ts'
import { normalizeLessonConfigLevels } from './localStorage.ts'
import { getLessonLevelsForVerbIds } from './verbLessonLevels.ts'

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

export type LibraryVerbScopeCounts = {
  total: number
  notLearnt: number
  learnt: number
}

/** Counts verbs by learnt state (requires `learnt.length === verbs.length`; otherwise notLearnt/learnt are 0). */
export function getLibraryVerbScopeCounts(lesson: LessonSave): LibraryVerbScopeCounts {
  const { verbs, learnt } = lesson
  const n = verbs.length
  if (learnt.length !== n) {
    return { total: n, notLearnt: 0, learnt: 0 }
  }
  let notLearnt = 0
  let learntCount = 0
  for (let i = 0; i < n; i++) {
    if (learnt[i]) learntCount += 1
    else notLearnt += 1
  }
  return { total: n, notLearnt, learnt: learntCount }
}

/** Trigger text for the library “which verbs” control (includes counts for not-learnt / learnt). */
export function getLibraryVerbScopeTriggerLabel(
  scope: LibraryVerbScope,
  counts: LibraryVerbScopeCounts,
): string {
  if (scope === 'all') return LIBRARY_VERB_SCOPE_LABELS.all
  if (scope === 'not_learnt') {
    return `${LIBRARY_VERB_SCOPE_LABELS.not_learnt} (${counts.notLearnt})`
  }
  return `${LIBRARY_VERB_SCOPE_LABELS.learnt} (${counts.learnt})`
}

/** Menu rows: “Not learnt” / “Learnt” show counts; those rows are disabled when the count is 0. “All” disabled when there are no verbs. */
export function getLibraryVerbScopeMenuSpec(counts: LibraryVerbScopeCounts): {
  key: LibraryVerbScope
  label: string
  disabled: boolean
}[] {
  return LIBRARY_VERB_SCOPE_OPTIONS.map((key) => {
    const disabled =
      key === 'all'
        ? counts.total === 0
        : key === 'not_learnt'
          ? counts.notLearnt === 0
          : counts.learnt === 0
    const label =
      key === 'all'
        ? LIBRARY_VERB_SCOPE_LABELS.all
        : key === 'not_learnt'
          ? `${LIBRARY_VERB_SCOPE_LABELS.not_learnt} (${counts.notLearnt})`
          : `${LIBRARY_VERB_SCOPE_LABELS.learnt} (${counts.learnt})`
    return { key, label, disabled }
  })
}

/**
 * Builds a lesson snapshot for storing in the library: optional filter by learnt state,
 * then `repeated` → 0 and `learnt` → false for every included verb.
 * Returns `null` if no verbs match the scope.
 */
export function buildLessonSaveForLibrary(
  lesson: LessonSave,
  scope: LibraryVerbScope,
): LessonSave | null {
  const { verbs, learnt, repeated, config } = lesson
  const n = verbs.length
  if (learnt.length !== n || repeated.length !== n) return null

  const indices: number[] = []
  for (let i = 0; i < n; i++) {
    if (scope === 'all') indices.push(i)
    else if (scope === 'not_learnt' && !learnt[i]) indices.push(i)
    else if (scope === 'learnt' && learnt[i]) indices.push(i)
  }

  if (indices.length === 0) return null

  return {
    config: { ...config },
    verbs: indices.map((i) => verbs[i]!),
    learnt: indices.map(() => false),
    repeated: indices.map(() => 0),
  }
}

/** Library entry whose `name` matches `name` when trimmed (case-insensitive). */
export function getLibraryLessonByName(language: Language, name: string): LessonSave | undefined {
  const library = loadLibraryFromLocalStorage(language)
  const key = name.trim().toLowerCase()
  return library.lessons.find((l) => (l.name?.trim() ?? '').toLowerCase() === key)
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
): LessonSave {
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

  return entry
}

export type MergeLibraryEntryResult = {
  entry: LessonSave
  addedVerbCount: number
}

/**
 * Merges verbs from `snapshot` into an existing library lesson (matched by trimmed case-insensitive name).
 * Duplicate verb ids are skipped. After merging verbs, `learnt` / `repeated` are reset (false / 0) for every row.
 * `config.level` is set from all merged verb ids (existing + added) via verbs JSON.
 * When `snapshot` is null, only the description is updated; verb lists and progress stay as stored.
 */
export async function mergeIntoLibraryEntry(
  language: Language,
  targetName: string,
  snapshot: LessonSave | null,
  description: string,
): Promise<MergeLibraryEntryResult | null> {
  const existing = getLibraryLessonByName(language, targetName)
  if (!existing) return null

  const nameForSave = existing.name?.trim() ?? targetName.trim()

  if (!snapshot) {
    const entry = saveLibraryEntry(language, existing, nameForSave, description)
    return { entry, addedVerbCount: 0 }
  }

  const { verbs: ev, config } = existing
  let mergedVerbs = [...ev]
  let addedVerbCount = 0

  const { verbs: sv, learnt: sl, repeated: sr } = snapshot
  if (sl.length !== sv.length || sr.length !== sv.length) return null

  const seen = new Set(ev)
  for (let i = 0; i < sv.length; i++) {
    const id = sv[i]!
    if (seen.has(id)) continue
    seen.add(id)
    mergedVerbs.push(id)
    addedVerbCount += 1
  }

  const level = await getLessonLevelsForVerbIds(language, mergedVerbs)

  const body: LessonSave = {
    config: { ...config, level },
    verbs: mergedVerbs,
    learnt: mergedVerbs.map(() => false),
    repeated: mergedVerbs.map(() => 0),
  }

  const entry = saveLibraryEntry(language, body, nameForSave, description)
  return { entry, addedVerbCount }
}

export type RemoveFromLibraryEntryResult = {
  entry: LessonSave
  removedVerbCount: number
}

/**
 * Removes from an existing library lesson every verb id that appears in `snapshot`.
 * `config.level` is recomputed from the remaining verb ids. Progress rows align with kept verbs.
 * When `snapshot` is null, only the description is updated.
 */
export async function removeMatchingVerbsFromLibraryEntry(
  language: Language,
  targetName: string,
  snapshot: LessonSave | null,
  description: string,
): Promise<RemoveFromLibraryEntryResult | null> {
  const existing = getLibraryLessonByName(language, targetName)
  if (!existing) return null

  const nameForSave = existing.name?.trim() ?? targetName.trim()

  if (!snapshot) {
    const entry = saveLibraryEntry(language, existing, nameForSave, description)
    return { entry, removedVerbCount: 0 }
  }

  const { verbs: ev, learnt: el, repeated: er, config } = existing
  if (el.length !== ev.length || er.length !== ev.length) return null

  const { verbs: rv } = snapshot
  const removeSet = new Set(rv)
  const keepIndices: number[] = []
  for (let i = 0; i < ev.length; i++) {
    if (!removeSet.has(ev[i]!)) keepIndices.push(i)
  }

  const removedVerbCount = ev.length - keepIndices.length
  const mergedVerbs = keepIndices.map((i) => ev[i]!)

  const level = await getLessonLevelsForVerbIds(language, mergedVerbs)

  const body: LessonSave = {
    config: { ...config, level },
    verbs: mergedVerbs,
    learnt: mergedVerbs.map(() => false),
    repeated: mergedVerbs.map(() => 0),
  }

  const entry = saveLibraryEntry(language, body, nameForSave, description)
  return { entry, removedVerbCount }
}
