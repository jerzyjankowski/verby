import type {Extra, LanguageConfig} from "../types/config.ts";
import type {Conjugation, ConjugationFlags, Verb} from "../types/verb.ts";

export const frenchConfig: LanguageConfig = {
  code: 'FRA',
  personsLabels: {
    s1: 'je',
    s2: 'tu',
    s3: 'il',
    p1: 'nous',
    p2: 'vous',
    p3: 'ils',
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