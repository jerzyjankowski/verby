import { LEVEL_OPTIONS, type Language, type Level } from '../types/config.ts'
import type { Verb } from '../types/verb.ts'
import { loadVerbsForLanguage } from './jsonVerbsLoader.ts'
import { verbMatchesLessonLevel } from './initLesson.ts'

/**
 * Distinct {@link Level} values that match at least one verb, in curriculum order (`LEVEL_OPTIONS`).
 */
export function lessonLevelsForVerbs(verbs: Verb[]): Level[] {
  return LEVEL_OPTIONS.filter((level) => verbs.some((v) => verbMatchesLessonLevel(v, level)))
}

/**
 * Loads the language verbs JSON and returns lesson levels implied by those verb rows (same rules as lesson filtering).
 */
export async function getLessonLevelsForVerbIds(
  language: Language,
  verbIds: number[],
): Promise<Level[]> {
  if (verbIds.length === 0) return []
  const all = await loadVerbsForLanguage(language)
  const idSet = new Set(verbIds)
  const matched = all.filter((v) => idSet.has(v.id))
  return lessonLevelsForVerbs(matched)
}
