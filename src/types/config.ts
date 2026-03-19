// Option types
export type Language = 'ESP' | 'ENG' | 'GER' | 'ITA' | 'FRA' | 'RUS'
export type Pool = 'all' | 'saved' | 'irregular'
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export type Direction = 'to_foreign' | 'to_native' | 'conjugation' | 'form'
export type Speed = 'same' | 'random'
export type Batch = 10 | 20 | 30 | 40 | 50 | 'ALL'

// Label maps (key → display string)
export const LANGUAGE_LABELS: Record<Language, string> = {
  ESP: 'Español',
  ENG: 'English',
  GER: 'Deutsch',
  ITA: 'Italian',
  FRA: 'Française',
  RUS: 'Pусский',
}

export const POOL_LABELS: Record<Pool, string> = {
  all: 'all',
  saved: 'saved',
  irregular: 'irregular',
}

export const LEVEL_LABELS: Record<Level, string> = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
}

export const DIRECTION_LABELS: Record<Direction, string> = {
  to_foreign: 'To Foreign',
  to_native: 'To Native',
  conjugation: 'Conjugation',
  form: 'Form'
}

export const SPEED_LABELS: Record<Speed, string> = {
  same: 'Same',
  random: 'Random',
}

export const BATCH_LABELS: Record<Batch, string> = {
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  ALL: 'ALL',
}

// Option arrays for dropdowns
export const LANGUAGE_OPTIONS: Language[] = ['ESP', 'ENG', 'GER', 'ITA', 'FRA', 'RUS']
export const POOL_OPTIONS: Pool[] = ['all', 'saved', 'irregular']
export const LEVEL_OPTIONS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1']
export const DIRECTION_OPTIONS: Direction[] = ['to_foreign', 'to_native', 'conjugation', 'form']
export const SPEED_OPTIONS: Speed[] = ['same', 'random']
export const BATCH_OPTIONS: Batch[] = [10, 20, 30, 40, 50, 'ALL']

export type LanguageConfig = {
  code: string,
  personsLabels: {
    s1: string,
    s2: string,
    s3: string,
    p1: string,
    p2: string,
    p3: string,
  }
  irregularFormsLabels: string[]
  irregularConjugationsLabels: string[]
}

// Config type (all required when saving)
export type LessonConfig = {
  language: Language
  pool: Pool
  level: Level
  direction: Direction
  directionConjugation?: number
  directionForm?: number
  speed: Speed
  batch: Batch
}

// Form state (optional until all selected)
export type LessonConfigFormState = {
  language?: Language
  pool?: Pool
  level?: Level
  direction?: Direction
  directionConjugation?: number
  directionForm?: number
  speed?: Speed
  batch?: Batch
}

export const CONFIG_STORAGE_KEY = 'config-_new'

export type LessonSave = {
  config: LessonConfig
  file: string
  name: string
  verbs: number[]
  learnt: boolean[]
  repeated: number[]
}