import {
  LANGUAGE_OPTIONS,
  type Extra,
  type Language,
  type LanguageConfig,
  type LanguageConfigLabels,
} from '../types/config.ts'
import type { Conjugation, ConjugationFlags, Verb } from '../types/verb.ts'
import { englishConfig } from './englishConfig.ts'
import { frenchConfig } from './frenchConfig.ts'
import { germanConfig } from './germanConfig.ts'
import { italianConfig } from './italianConfig.ts'
import { russianConfig } from './russianConfig.ts'
import { spanishConfig } from './spanishConfig.ts'

const emptyLanguageLabels: LanguageConfigLabels = {
  personsLabels: { s1: '', s2: '', s3: '', p1: '', p2: '', p3: '' },
  formsLabels: [],
  conjugationsLabels: [],
}

const emptyConjugation: Conjugation = { s1: '', s2: '', s3: '', p1: '', p2: '', p3: '' }
const emptyConjugationFlags: ConjugationFlags = {
  s1: false,
  s2: false,
  s3: false,
  p1: false,
  p2: false,
  p3: false,
}

/** Fallback when no language is selected or the code is not in {@link LANGUAGE_CONFIG_MAP}. */
export const EMPTY_LANGUAGE_CONFIG: LanguageConfig = {
  code: LANGUAGE_OPTIONS[0],
  verbsFilePath: '',
  languageLabels: emptyLanguageLabels,
  getForms: (_verb: Verb) => [],
  conjugate: (_verb: Verb, _conjugationId: number) => ({
    conjugation: emptyConjugation,
    irregularity: emptyConjugationFlags,
  }),
  isIrregular: (_verb: Verb, _extra: Extra, _id?: number) => false,
}

/** Maps each lesson language code to its `configs/*Config` module. */
export const LANGUAGE_CONFIG_MAP: Record<Language, LanguageConfig> = {
  ESP: spanishConfig,
  ENG: englishConfig,
  GER: germanConfig,
  ITA: italianConfig,
  FRA: frenchConfig,
  RUS: russianConfig,
}

function isLanguage(value: string | undefined): value is Language {
  return value !== undefined && Object.prototype.hasOwnProperty.call(LANGUAGE_CONFIG_MAP, value)
}

export function getLanguageConfig(language: Language | undefined): LanguageConfig {
  if (!isLanguage(language)) {
    return EMPTY_LANGUAGE_CONFIG
  }
  return LANGUAGE_CONFIG_MAP[language]
}
