import type {Conjugation, ConjugationFlags} from "./verb.ts";

export type Round = {
  verbId: number,
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