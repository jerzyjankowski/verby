import type {Extra, LanguageConfig} from "../types/config.ts";
import type {Conjugation, ConjugationFlags, Verb} from "../types/verb.ts";


export const englishConfig: LanguageConfig = {
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

export const getForms = (verb: Verb): {
  form: string,
  irregularity: boolean
}[] => {
  return []
}

export const conjugate = (verb: Verb, conjugationId: number): {
  conjugation: Conjugation,
  irregularity: ConjugationFlags
} => {
  return {
    conjugation: { s1: '', s2: '', s3: '', p1: '', p2: '', p3: '', },
    irregularity: { s1: false, s2: false, s3: false, p1: false, p2: false, p3: false, },
  }
}

export const isIrregular = (verb: Verb, extra: Extra, id?: number): boolean => {
  return false
}