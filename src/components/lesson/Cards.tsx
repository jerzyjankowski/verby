import type {Round, UpdateRoundHiddenFlags} from '../../types/lesson.ts'
import type {Conjugation} from "../../types/verb.ts";
import {spanishConfig} from "../../configs/esp.ts";

type CardsProps = {
  round: Round
  updateRoundHiddenFlags: UpdateRoundHiddenFlags
}

type ConjugationAnswerCardProps = {
  placeholder: string
  answer: string
  isHidden: boolean
  onClick: () => void
}

function ConjugationAnswerCard({ placeholder, answer, isHidden, onClick }: ConjugationAnswerCardProps) {
  return (
    <div
      className="bg-primary-darker border border-primary-darkest rounded-xl flex min-h-20 items-center justify-center p-4"
      onClick={onClick}
    >
      {isHidden ? (
        <p className="text-center text-lg italic">{placeholder}</p>
      ) : (
        <p className="text-center text-2xl font-semibold">{answer}</p>
      )}
    </div>
  )
}

export default function Cards({ round, updateRoundHiddenFlags }: CardsProps) {
  const personsLabels: Conjugation = spanishConfig.personsLabels

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="bg-primary-darker border border-primary-darkest rounded-xl flex flex-1 items-center justify-center p-4">
        <p className="text-center text-4xl font-semibold">{round.question}</p>
      </div>

      <div
        className={`bg-primary-darker border border-primary-darkest rounded-xl flex items-center justify-center p-4 ${
          round.isConjugation ? 'min-h-20' : 'flex-1'
        }`}
        onClick={() => {updateRoundHiddenFlags(false, round?.conjugationAnswersHidden)}}
      >
        {round.answerHidden ? (
          <p className="text-center text-lg italic">???</p>
        ) : (
          <p className={`text-center ${round.isConjugation ? 'text-2xl' : 'text-4xl'} font-semibold`}>{round.answer}</p>
        )}
      </div>

      {round.isConjugation && (
        <div className="grid grid-cols-2 grid-rows-3 gap-3">
          <ConjugationAnswerCard
            placeholder={personsLabels.s1}
            answer={round.conjugationAnswers.s1}
            isHidden={round.conjugationAnswersHidden.s1}
            onClick={() => updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, s1: false })}
          />
          <ConjugationAnswerCard
            placeholder={personsLabels.p1}
            answer={round.conjugationAnswers.p1}
            isHidden={round.conjugationAnswersHidden.p1}
            onClick={() => updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, p1: false })}
          />
          <ConjugationAnswerCard
            placeholder={personsLabels.s2}
            answer={round.conjugationAnswers.s2}
            isHidden={round.conjugationAnswersHidden.s2}
            onClick={() => updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, s2: false })}
          />
          <ConjugationAnswerCard
            placeholder={personsLabels.p2}
            answer={round.conjugationAnswers.p2}
            isHidden={round.conjugationAnswersHidden.p2}
            onClick={() => updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, p2: false })}
          />
          <ConjugationAnswerCard
            placeholder={personsLabels.s3}
            answer={round.conjugationAnswers.s3}
            isHidden={round.conjugationAnswersHidden.s3}
            onClick={() => updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, s3: false })}
          />
          <ConjugationAnswerCard
            placeholder={personsLabels.p3}
            answer={round.conjugationAnswers.p3}
            isHidden={round.conjugationAnswersHidden.p3}
            onClick={() => updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, p3: false })}
          />
        </div>
      )}
    </div>
  )
}
