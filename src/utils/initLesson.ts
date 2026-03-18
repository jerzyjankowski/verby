import type { Config, LessonConfig } from '../types/config'

import { loadVerbsFromJson } from './jsonVerbsLoader'
import { saveLessonToLocalStorage } from './localStorage'

const LESSON_FILE = '/data/esp/verbs.json'
const LESSON_NAME = '_new'

export async function initLesson(config: Config): Promise<LessonConfig> {
  const verbsData = await loadVerbsFromJson(LESSON_FILE)

  const verbs: number[] = verbsData.map((v) => v.id)
  const learnt: boolean[] = verbsData.map(() => false)
  const repeated: number[] = verbsData.map(() => 0)

  const lesson: LessonConfig = {
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
