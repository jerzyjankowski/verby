import type {Direction, LanguageConfig} from "../types/config.ts";
import type {Conjugation, ConjugationFlags, Verb} from "../types/verb.ts";


export const spanishConfig: LanguageConfig = {
  code: 'esp',
  personsLabels: {
    s1: 'yo',
    s2: 'tú',
    s3: 'él',
    p1: 'nos.',
    p2: 'vos.',
    p3: 'ellos',
  },
  irregularFormsLabels: [
    'gerundio',
    'participio passivo',
  ],
  irregularConjugationsLabels: [
    'Presente de indicativo',
    'Pretérito indefinido',
    'Imperfecto de indicativo',
    'Condicional simple',
    'Futuro imperfecto de indicativo',
    'Presente de subjuntivo',
    'Imperfecto de subjuntivo',
    'Imperfecto de subjuntivo2',
    'Futurede subjuntivo',
    'Imperatife affirmative',
    'Imperatife negative',
  ]
}

type SpanishConjugation = 'ar' | 'er' | 'ir'

const irregularFormsEndings = {
  'ar': [
    'ando',
    'ado'
  ],
  'er': [
    'iendo',
    'ido'
  ],
  'ir': [
    'iendo',
    'ido'
  ]
}

const conjugationEndings = {
  'ar': [
    // Presente de indicativo
    {
      s1: 'o', s2: 'as', s3: 'a',
      p1: 'amos', p2: 'áis', p3: 'an',
    },
    // Pretérito indefinido
    {
      s1: 'é', s2: 'aste', s3: 'ó',
      p1: 'amos', p2: 'asteis', p3: 'aron',
    },
    // Imperfecto de indicativo
    {
      s1: 'aba', s2: 'abas', s3: 'aba',
      p1: 'ábamos', p2: 'abais', p3: 'aban',
    },
    // Condicional simple
    {
      s1: 'aría', s2: 'arías', s3: 'aría',
      p1: 'aríamos', p2: 'aríais', p3: 'arían',
    },
    // Futuro imperfecto de indicativo
    {
      s1: 'aré', s2: 'arás', s3: 'ará',
      p1: 'aremos', p2: 'aréis', p3: 'arán',
    },
    // Presente de subjuntivo
    {
      s1: 'e', s2: 'es', s3: 'e',
      p1: 'emos', p2: 'éis', p3: 'en',
    },
    // Imperfecto de subjuntivo
    {
      s1: 'ara', s2: 'aras', s3: 'ara',
      p1: 'áramos', p2: 'arais', p3: 'aran',
    },
    // Imperfecto de subjuntivo2
    {
      s1: 'ase', s2: 'ases', s3: 'ase',
      p1: 'ásemos', p2: 'aseis', p3: 'asen',
    },
    // Futurede subjuntivo
    {
      s1: 'are', s2: 'ares', s3: 'are',
      p1: 'áremos', p2: 'areis', p3: 'aren',
    },
    // imperatife affirmative
    {
      s1: '', s2: 'a', s3: 'e',
      p1: 'emos', p2: 'ad', p3: 'en',
    },
    // imperatife negative
    {
      s1: '', s2: 'es', s3: 'e',
      p1: 'emos', p2: 'éis', p3: 'en',
    },
  ],
  'er': [
    // Presente de indicativo
    {
      s1: 'o', s2: 'es', s3: 'e',
      p1: 'emos', p2: 'éis', p3: 'en',
    },
    // Pretérito indefinido
    {
      s1: 'í', s2: 'iste', s3: 'ió',
      p1: 'imos', p2: 'isteis', p3: 'ieron',
    },
    // Imperfecto de indicativo
    {
      s1: 'ía', s2: 'ías', s3: 'ía',
      p1: 'íamos', p2: 'íais', p3: 'ían',
    },
    // Condicional simple
    {
      s1: 'ería', s2: 'erías', s3: 'ería',
      p1: 'eríamos', p2: 'eríais', p3: 'erían',
    },
    // Futuro imperfecto de indicativo
    {
      s1: 'eré', s2: 'erás', s3: 'erá',
      p1: 'eremos', p2: 'eréis', p3: 'erán',
    },
    // Presente de subjuntivo
    {
      s1: 'a', s2: 'as', s3: 'a',
      p1: 'amos', p2: 'áis', p3: 'an',
    },
    // Imperfecto de subjuntivo
    {
      s1: 'iera', s2: 'ieras', s3: 'iera',
      p1: 'iéramos', p2: 'ierais', p3: 'ieran',
    },
    // Imperfecto de subjuntivo2
    {
      s1: 'iese', s2: 'ieses', s3: 'iese',
      p1: 'iésemos', p2: 'ieseis', p3: 'iesen',
    },
    // Futurede subjuntivo
    {
      s1: 'iere', s2: 'ieres', s3: 'iere',
      p1: 'iéremos', p2: 'iereis', p3: 'ieren',
    },
    // imperatife affirmative
    {
      s1: '', s2: 'e', s3: 'a',
      p1: 'amos', p2: 'ed', p3: 'an',
    },
    // imperatife negative
    {
      s1: '', s2: 'as', s3: 'a',
      p1: 'amos', p2: 'áis', p3: 'an',
    },
  ],
  'ir': [
    // Presente de indicativo
    {
      s1: 'o', s2: 'es', s3: 'e',
      p1: 'imos', p2: 'ís', p3: 'en',
    },
    // Pretérito indefinido
    {
      s1: 'í', s2: 'iste', s3: 'ió',
      p1: 'imos', p2: 'isteis', p3: 'ieron',
    },
    // Imperfecto de indicativo
    {
      s1: 'ía', s2: 'ías', s3: 'ía',
      p1: 'íamos', p2: 'íais', p3: 'ían',
    },
    // Condicional simple
    {
      s1: 'iría', s2: 'irías', s3: 'iría',
      p1: 'iríamos', p2: 'iríais', p3: 'irían',
    },
    // Futuro imperfecto de indicativo
    {
      s1: 'iré', s2: 'irás', s3: 'irá',
      p1: 'iremos', p2: 'iréis', p3: 'irán',
    },
    // Presente de subjuntivo
    {
      s1: 'a', s2: 'as', s3: 'a',
      p1: 'amos', p2: 'áis', p3: 'an',
    },
    // Imperfecto de subjuntivo
    {
      s1: 'iera', s2: 'ieras', s3: 'iera',
      p1: 'iéramos', p2: 'ierais', p3: 'ieran',
    },
    // Imperfecto de subjuntivo2
    {
      s1: 'iese', s2: 'ieses', s3: 'iese',
      p1: 'iésemos', p2: 'ieseis', p3: 'iesen',
    },
    // Futurede subjuntivo
    {
      s1: 'iere', s2: 'ieres', s3: 'iere',
      p1: 'iéremos', p2: 'iereis', p3: 'ieren',
    },
    // imperatife affirmative
    {
      s1: '', s2: 'e', s3: 'a',
      p1: 'amos', p2: 'id', p3: 'an',
    },
    // imperatife negative
    {
      s1: '', s2: 'as', s3: 'a',
      p1: 'amos', p2: 'áis', p3: 'an',
    },
  ]
}

export const getCorrectForm = (verb: Verb, formId: number): {
  form: string,
  irregularity: boolean
} => {
  const regularForm = `${verb.root}${(irregularFormsEndings[verb.conjugation as SpanishConjugation] as string[])[formId]}`
  return {
    form: !!verb.irregularForms[formId] ? verb.irregularForms[formId] : regularForm,
    irregularity: !!verb.irregularForms[formId]
  }
}

export const conjugate = (verb: Verb, conjugationId: number): {
  conjugation: Conjugation,
  irregularity: ConjugationFlags
} => {
  const irregularConjugation = verb.irregularConjugations[conjugationId]
  const endings = (conjugationEndings[verb.conjugation as SpanishConjugation] as Conjugation[])[conjugationId]
  const root = verb.root

  const irregularity = {
    s1: !!irregularConjugation.s1,
    s2: !!irregularConjugation.s2,
    s3: !!irregularConjugation.s3,
    p1: !!irregularConjugation.p1,
    p2: !!irregularConjugation.p2,
    p3: !!irregularConjugation.p3,
  }

  const conjugation = {
    s1: irregularity.s1 ? irregularConjugation.s1 : `${endings.s1 ? `${root}${endings.s1}` : '---'}`,
    s2: irregularity.s2 ? irregularConjugation.s2 : `${root}${endings.s2}`,
    s3: irregularity.s3 ? irregularConjugation.s3 : `${root}${endings.s3}`,
    p1: irregularity.p1 ? irregularConjugation.p1 : `${root}${endings.p1}`,
    p2: irregularity.p2 ? irregularConjugation.p2 : `${root}${endings.p2}`,
    p3: irregularity.p3 ? irregularConjugation.p3 : `${root}${endings.p3}`,
  }

  return {
    conjugation,
    irregularity
  }
}

export const isIrregular = (verb: Verb, direction: Direction, id?: number): boolean => {
  if (id === undefined) {
    return false
  }
  if (direction === 'conjugation') {
    const { irregularity } = conjugate(verb, id)
    return irregularity.s1 || irregularity.s2 || irregularity.s3 || irregularity.p1 || irregularity.p2 || irregularity.p3
  } else if (direction === 'form') {
    const { irregularity } = getCorrectForm(verb, id)
    return irregularity
  } else {
    return false
  }
}