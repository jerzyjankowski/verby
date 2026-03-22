import type { LanguageConfig, LessonConfig, LessonSave, Level } from '../types/config.ts'
import { shuffle } from 'lodash'

import { loadVerbsFromJson } from './jsonVerbsLoader'
import type { Verb } from '../types/verb.ts'
import { getLibraryLessonByName } from './library.ts'

export function verbMatchesLessonLevel(verb: Verb, level: Level): boolean {
  if (level === 'MAIN') return verb.sublevel === 'main'
  if (level === 'A0')
    return verb.sublevel === 'main' || verb.sublevel === 'A0'
  return verb.level === level
}

/** Verbs matching level and regularity filters (before shuffle / batch cap). */
export function filterVerbsMatchingLessonConfig(
  verbsData: Verb[],
  config: LessonConfig,
  languageConfig: LanguageConfig,
): Verb[] {
  const filteredVerbsByLevels = verbsData.filter((verb) =>
    config.levels.some((level) => verbMatchesLessonLevel(verb, level)),
  )
  return filteredVerbsByLevels.filter((verb) => {
    const irregular = languageConfig.isIrregular(
      verb,
      config.extra,
      config.extra === 'conjugation' ? config.conjugation : undefined,
    )
    return config.regularity === 'irregular'
      ? irregular
      : config.regularity === 'regular'
        ? !irregular
        : true
  })
}

export async function countVerbsMatchingLessonConfig(
  config: LessonConfig,
  languageConfig: LanguageConfig,
): Promise<number> {
  const verbsData = await loadVerbsFromJson(languageConfig.verbsFilePath)
  return filterVerbsMatchingLessonConfig(verbsData, config, languageConfig).length
}

/** Verbs matching level/regularity filters, before shuffle batch cap. */
export type InitLessonResult = {
  lesson: LessonSave
  availableVerbCountBeforeBatch: number
}

export type InitLessonOptions = {
  /** Library save name (trimmed, case-insensitive match). When set and found, only those verb ids are considered before other filters. */
  libraryLessonSaveName?: string
}

export async function initLesson(
  config: LessonConfig,
  languageConfig: LanguageConfig,
  options?: InitLessonOptions,
): Promise<InitLessonResult> {
  const verbsData = await loadVerbsFromJson(languageConfig.verbsFilePath)
  let pool = verbsData
  const name = options?.libraryLessonSaveName?.trim()
  if (name) {
    const entry = getLibraryLessonByName(config.language, name)
    if (entry?.verbs?.length) {
      const allow = new Set(entry.verbs)
      pool = verbsData.filter((v) => allow.has(v.id))
    }
  }
  const filteredVerbsByRegularity = filterVerbsMatchingLessonConfig(
    pool,
    config,
    languageConfig,
  )
  const availableVerbCountBeforeBatch = filteredVerbsByRegularity.length

  const filteredVerbs: Verb[] = []
  const shuffled = shuffle(filteredVerbsByRegularity)
  if (config.batch === 'ALL') {
    filteredVerbs.push(...shuffled)
  } else {
    filteredVerbs.push(...shuffled.slice(0, config.batch))
  }


  const verbs: number[] = filteredVerbs.map((v) => v.id)
  const learnt: boolean[] = filteredVerbs.map(() => false)
  const repeated: number[] = filteredVerbs.map(() => 0)

  return {
    lesson: {
      config,
      verbs,
      learnt,
      repeated,
    },
    availableVerbCountBeforeBatch,
  }
}
