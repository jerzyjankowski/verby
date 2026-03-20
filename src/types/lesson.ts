import type {Conjugation, ConjugationFlags} from "./verb.ts";

export type Round = {
  verbId: number,
  question: string,
  isConjugation: boolean,
  answer: string,
  answerHidden: boolean,
  answerIrregular: boolean,
  conjugationAnswers: Conjugation,
  conjugationAnswersHidden: ConjugationFlags
  conjugationAnswersIrregulars: ConjugationFlags
}

export type UpdateRoundHiddenFlags = (answerHidden: boolean, conjugationAnswersHidden: ConjugationFlags) => void