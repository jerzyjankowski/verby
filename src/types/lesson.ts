export type VerbLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type IrregularConjugation = {
  s1: string
  s2: string
  s3: string
  p1: string
  p2: string
  p3: string
}

export type Verb = {
  id: number
  level: VerbLevel
  verb: string
  meaning: string
  root: string
  conjugation: string
  irregularForms: string[]
  irregularConjugations: IrregularConjugation[]
}
