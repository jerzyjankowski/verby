import type {Conjugation, ConjugationFlags, VerbLevel} from "./verb.ts";

export type Round = {
  verbId: number,
  level: VerbLevel
  question: string,
  isConjugation: boolean,
  isForms: boolean,
  answer: string,
  answerHidden: boolean,
  answerIrregular: boolean,
  conjugationAnswers: Conjugation,
  conjugationAnswersHidden: ConjugationFlags
  conjugationAnswersIrregulars: ConjugationFlags
  formsAnswers: string[]
  formsAnswersHidden: boolean[]
  formsAnswersIrregulars: boolean[]
}

export type UpdateRoundHiddenFlags = (answerHidden: boolean, conjugationAnswersHidden: ConjugationFlags, formsAnswersHidden: boolean[]) => void