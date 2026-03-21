import type {Extra, LanguageConfig, LanguageConfigLabels} from "../types/config.ts";
import type {Conjugation, ConjugationFlags, Verb} from "../types/verb.ts";


const languageLabels: LanguageConfigLabels = {
  code: 'ENG',
  personsLabels: {
    s1: 'I',
    s2: 'you',
    s3: 'he',
    p1: 'we',
    p2: 'you',
    p3: 'they',
  },
  formsLabels: [],
  conjugationsLabels: []
}

const getForms = (_verb: Verb): {
  form: string,
  irregularity: boolean
}[] => {
  return []
}

const conjugate = (_verb: Verb, _conjugationId: number): {
  conjugation: Conjugation,
  irregularity: ConjugationFlags
} => {
  return {
    conjugation: { s1: '', s2: '', s3: '', p1: '', p2: '', p3: '', },
    irregularity: { s1: false, s2: false, s3: false, p1: false, p2: false, p3: false, },
  }
}

const isIrregular = (_verb: Verb, _extra: Extra, _id?: number): boolean => {
  return false
}

export const spanishConfig: LanguageConfig = {
  languageLabels,
  getForms,
  conjugate,
  isIrregular,
}