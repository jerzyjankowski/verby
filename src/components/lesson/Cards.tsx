import type {Round, UpdateRoundHiddenFlags} from '../../types/lesson.ts'
import { useState } from 'react'
import type {Conjugation} from "../../types/verb.ts";
import {spanishConfig} from "../../configs/spanishConfig.ts";
import AnswerDetails from './settings/AnswerDetails.tsx'
import ClampText from '../shared/ClampText.tsx'

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

function getCardTextSize(text: string, defaultSize: string) {
  return text.length > 40 ? 'text-2xl' : defaultSize
}

function ConjugationAnswerCard({ placeholder, answer, isHidden, onClick }: ConjugationAnswerCardProps) {
  const answerTextSize = getCardTextSize(answer, 'text-2xl')

  return (
    <div
      className="bg-primary-darker border border-primary-darkest rounded-xl flex min-h-20 items-center justify-center p-4"
      onClick={onClick}
    >
      {isHidden ? (
        <p className="text-center text-lg italic">{placeholder}</p>
      ) : (
        <ClampText className={`w-full overflow-hidden text-center ${answerTextSize} font-semibold`} text={answer} lines={1} />
      )}
    </div>
  )
}

export default function Cards({ round, updateRoundHiddenFlags }: CardsProps) {
  const personsLabels: Conjugation = spanishConfig.personsLabels
  const formsLabels: string[] = spanishConfig.formsLabels
  const questionTextSize = getCardTextSize(round.question, 'text-4xl')
  const answerTextSize = getCardTextSize(round.answer, round.isConjugation || round.isForms ? 'text-2xl' : 'text-4xl')
  const [isFullTextSheetOpen, setIsFullTextSheetOpen] = useState(false)
  const [fullText, setFullText] = useState('')
  const [fullTextTitle, setFullTextTitle] = useState('Full text')

  function openFullTextSheet(text: string, title: string) {
    setFullText(text)
    setFullTextTitle(title)
    setIsFullTextSheetOpen(true)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div
        className="bg-primary-darker border border-primary-darkest rounded-xl flex flex-1 cursor-pointer items-center justify-center p-4"
        onClick={() => openFullTextSheet(round.question, 'Question')}
      >
        <ClampText className={`w-full overflow-hidden text-center ${questionTextSize} leading-normal font-semibold`} text={round.question} />
      </div>

      <div
        className={`bg-primary-darker border border-primary-darkest rounded-xl flex cursor-pointer items-center justify-center p-4 ${
          round.isConjugation || round.isForms ? 'min-h-20' : 'flex-1'
        }`}
        onClick={() => {
          if (round.answerHidden) {
            updateRoundHiddenFlags(false, round.conjugationAnswersHidden, round.formsAnswersHidden)
            return
          }

          openFullTextSheet(round.answer, 'Answer')
        }}
      >
        {round.answerHidden ? (
          <p className="text-center text-lg italic">???</p>
        ) : (
          <ClampText className={`w-full overflow-hidden text-center ${answerTextSize} font-semibold`} text={round.answer} />
          )}
      </div>

      {round.isConjugation && (
        <div className="grid grid-cols-2 grid-rows-3 gap-3">
          <ConjugationAnswerCard
            placeholder={personsLabels.s1}
            answer={round.conjugationAnswers.s1}
            isHidden={round.conjugationAnswersHidden.s1}
            onClick={() => {
              if (round.conjugationAnswersHidden.s1) {
                updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, s1: false }, round.formsAnswersHidden)
                return
              }

              openFullTextSheet(round.conjugationAnswers.s1, personsLabels.s1)
            }}
          />
          <ConjugationAnswerCard
            placeholder={personsLabels.p1}
            answer={round.conjugationAnswers.p1}
            isHidden={round.conjugationAnswersHidden.p1}
            onClick={() => {
              if (round.conjugationAnswersHidden.p1) {
                updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, p1: false }, round.formsAnswersHidden)
                return
              }

              openFullTextSheet(round.conjugationAnswers.p1, personsLabels.p1)
            }}
          />
          <ConjugationAnswerCard
            placeholder={personsLabels.s2}
            answer={round.conjugationAnswers.s2}
            isHidden={round.conjugationAnswersHidden.s2}
            onClick={() => {
              if (round.conjugationAnswersHidden.s2) {
                updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, s2: false }, round.formsAnswersHidden)
                return
              }

              openFullTextSheet(round.conjugationAnswers.s2, personsLabels.s2)
            }}
          />
          <ConjugationAnswerCard
            placeholder={personsLabels.p2}
            answer={round.conjugationAnswers.p2}
            isHidden={round.conjugationAnswersHidden.p2}
            onClick={() => {
              if (round.conjugationAnswersHidden.p2) {
                updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, p2: false }, round.formsAnswersHidden)
                return
              }

              openFullTextSheet(round.conjugationAnswers.p2, personsLabels.p2)
            }}
          />
          <ConjugationAnswerCard
            placeholder={personsLabels.s3}
            answer={round.conjugationAnswers.s3}
            isHidden={round.conjugationAnswersHidden.s3}
            onClick={() => {
              if (round.conjugationAnswersHidden.s3) {
                updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, s3: false }, round.formsAnswersHidden)
                return
              }

              openFullTextSheet(round.conjugationAnswers.s3, personsLabels.s3)
            }}
          />
          <ConjugationAnswerCard
            placeholder={personsLabels.p3}
            answer={round.conjugationAnswers.p3}
            isHidden={round.conjugationAnswersHidden.p3}
            onClick={() => {
              if (round.conjugationAnswersHidden.p3) {
                updateRoundHiddenFlags(round.answerHidden, { ...round.conjugationAnswersHidden, p3: false }, round.formsAnswersHidden)
                return
              }

              openFullTextSheet(round.conjugationAnswers.p3, personsLabels.p3)
            }}
          />
        </div>
      )}

      {round.isForms && (
        <div className="flex flex-col gap-3">
          {round.formsAnswers.map((answer, index) => (
            <ConjugationAnswerCard
              key={`form-${index}`}
              placeholder={formsLabels[index] ?? `Form ${index + 1}`}
              answer={answer}
              isHidden={round.formsAnswersHidden[index] ?? true}
              onClick={() => {
                if (round.formsAnswersHidden[index]) {
                  const nextHidden = [...round.formsAnswersHidden]
                  nextHidden[index] = false
                  updateRoundHiddenFlags(round.answerHidden, round.conjugationAnswersHidden, nextHidden)
                  return
                }

                openFullTextSheet(answer, formsLabels[index] ?? `Form ${index + 1}`)
              }}
            />
          ))}
        </div>
      )}

      <AnswerDetails
        open={isFullTextSheetOpen}
        onOpenChange={setIsFullTextSheetOpen}
        title={fullTextTitle}
        text={fullText}
        round={round}
        personsLabels={personsLabels}
        formsLabels={formsLabels}
      />
    </div>
  )
}
