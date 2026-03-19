import type { LessonConfig, LessonSave } from '../types/config.ts'

import { loadVerbsFromJson } from './jsonVerbsLoader'
import { saveLessonToLocalStorage } from './localStorage'

const LESSON_FILE = '/data/esp/verbs.json'
const LESSON_NAME = '_new'

export async function initLesson(config: LessonConfig): Promise<LessonSave> {
  const verbsData = await loadVerbsFromJson(LESSON_FILE)

  const verbs: number[] = verbsData.map((v) => v.id)
  const learnt: boolean[] = verbsData.map(() => false)
  const repeated: number[] = verbsData.map(() => 0)

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
