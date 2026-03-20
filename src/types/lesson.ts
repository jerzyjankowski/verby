import type {Conjugation, ConjugationFlags} from "./verb.ts";

export type Round = {
  question: string,
  isConjugation: boolean,
  answer?: string,
  answerHidden?: boolean,
  conjugationAnswers?: Conjugation,
  conjugationAnswersHidden?: ConjugationFlags
}