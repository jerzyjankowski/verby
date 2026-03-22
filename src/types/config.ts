import type {Conjugation, ConjugationFlags, Verb} from "./verb.ts";

export type Language = 'ESP' | 'ENG' | 'GER' | 'ITA' | 'FRA' | 'RUS'
export type Regularity = 'all' | 'irregular' | 'regular'
export type Level = 'MAIN' | 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export type Direction = 'to_foreign' | 'to_native'
export type Extra = 'no' | 'conjugation' | 'forms'
export type Speed = 'same' | 'random'
export type Batch = 10 | 20 | 30 | 40 | 50 | 'ALL'

export const LANGUAGE_OPTIONS: Language[] = ['ESP', 'ENG', 'GER', 'ITA', 'FRA', 'RUS']
export const REGULARITY_OPTIONS: Regularity[] = ['all', 'irregular', 'regular']
export const LEVEL_OPTIONS: Level[] = ['MAIN', 'A0', 'A1', 'A2', 'B1', 'B2', 'C1']
export const DIRECTION_OPTIONS: Direction[] = ['to_foreign', 'to_native']
export const EXTRA_OPTIONS: Extra[] = ['no', 'conjugation', 'forms']
export const SPEED_OPTIONS: Speed[] = ['same', 'random']
export const BATCH_OPTIONS: Batch[] = ['ALL', 10, 20, 30, 40, 50]

export type LanguageConfigLabels = {
  personsLabels: {
    s1: string,
    s2: string,
    s3: string,
    p1: string,
    p2: string,
    p3: string,
  }
  formsLabels: string[]
  conjugationsLabels: string[]
}

export type LanguageConfig = {
  code: Language,
  verbsFilePath: string
  languageLabels: LanguageConfigLabels
  getForms: (verb: Verb) => {
    form: string,
    irregularity: boolean
  }[],
  conjugate: (verb: Verb, conjugationId: number) => {
    conjugation: Conjugation,
    irregularity: ConjugationFlags
  },
  isIrregular: (verb: Verb, extra: Extra, id?: number) => boolean
}

export type LessonConfig = {
  language: Language
  regularity: Regularity
  levels: Level[]
  direction: Direction
  extra: Extra
  conjugation?: number
  speed: Speed
  batch: Batch
}

export type LessonConfigFormState = {
  language?: Language
  regularity?: Regularity
  levels?: Level[]
  direction?: Direction
  extra?: Extra
  conjugation?: number
  speed?: Speed
  batch?: Batch
  libraryLessonSaveName?: string
  name?: string
  description?: string
}

export type LessonSave = {
  config: LessonConfig
  verbs: number[]
  learnt: boolean[]
  repeated: number[]
  history: number[]
  /** Current flashcard verb when saved to local storage (quick save); not stored in library. */
  lastVerbId?: number
  name?: string
  description?: string
}

export type Library = {
  language: Language
  lessons: LessonSave[]
}