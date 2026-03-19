export type VerbLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type Conjugation = {
  s1: string
  s2: string
  s3: string
  p1: string
  p2: string
  p3: string
}

export type ConjugationIrregularity = {
  s1: boolean
  s2: boolean
  s3: boolean
  p1: boolean
  p2: boolean
  p3: boolean
}

export type Verb = {
  id: number
  level: VerbLevel
  verb: string
  meaning: string
  root: string
  conjugation: string
  irregularForms: string[]
  irregularConjugations: Conjugation[]
}
