import type { LessonConfig, LessonSave } from '../types/config.ts'
import { shuffle } from 'lodash'

import { loadVerbsFromJson } from './jsonVerbsLoader'
import { saveLessonToLocalStorage } from './localStorage'
import {isIrregular} from "../configs/esp.ts";
import type {Verb} from "../types/verb.ts";

const LESSON_FILE = '/data/esp/verbs.json'
const LESSON_NAME = '_new'

export async function initLesson(config: LessonConfig): Promise<LessonSave> {
  const verbsData = await loadVerbsFromJson(LESSON_FILE)

  const filteredVerbsByLevels = verbsData.filter(verb => verb.level === config.level)
  const filteredVerbsByRegularity = filteredVerbsByLevels.filter(verb => {
    const irregular = isIrregular(verb, config.extra, config.extra === 'conjugation' ? config.directionConjugation : undefined)
    return config.regularity === 'irregular' ? irregular : config.regularity === 'regular' ? !irregular : true
  })
  console.log('[JJ]filteredVerbsByLevels', filteredVerbsByLevels.length)
  console.log('[JJ]filteredVerbsByRegularity', filteredVerbsByRegularity.length)

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

  const lesson: LessonSave = {
    config,
    file: LESSON_FILE,
    name: LESSON_NAME,
    verbs,
    learnt,
    repeated,
  }

  saveLessonToLocalStorage(lesson)
  return lesson
}
