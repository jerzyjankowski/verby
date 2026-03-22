import type { LanguageConfig, LessonConfig, LessonSave } from '../types/config.ts'
import { shuffle } from 'lodash'

import { loadVerbsFromJson } from './jsonVerbsLoader'
import type { Verb } from '../types/verb.ts'

/** Verbs matching level and regularity filters (before shuffle / batch cap). */
export function filterVerbsMatchingLessonConfig(
  verbsData: Verb[],
  config: LessonConfig,
  languageConfig: LanguageConfig,
): Verb[] {
  const filteredVerbsByLevels =
    config.level === 'MAIN'
      ? verbsData.filter((verb) => verb.sublevel === 'main')
      : config.level === 'A0'
        ? verbsData.filter(
            (verb) => verb.sublevel === 'main' || verb.sublevel === 'A0',
          )
        : verbsData.filter((verb) => verb.level === config.level)
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

export async function initLesson(
  config: LessonConfig,
  languageConfig: LanguageConfig,
): Promise<InitLessonResult> {
  const verbsData = await loadVerbsFromJson(languageConfig.verbsFilePath)
  const filteredVerbsByRegularity = filterVerbsMatchingLessonConfig(
    verbsData,
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
