import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import * as Switch from '@radix-ui/react-switch'

import type { Round } from '../../../types/lesson.ts'
import type { Conjugation } from '../../../types/verb.ts'
import { ui } from '../../../locales'
import Sheet from '../../shared/Sheet.tsx'

const conjugationKeys = ['s1', 's2', 's3', 'p1', 'p2', 'p3'] as const

function isMainDisplayedTextIrregular(round: Round, text: string): boolean {
  if (text === round.question) return false
  if (round.answer === text && round.answerIrregular) return true
  if (round.isConjugation) {
    for (const k of conjugationKeys) {
      if (round.conjugationAnswers[k] === text && round.conjugationAnswersIrregulars[k]) {
        return true
      }
    }
  }
  if (round.isForms) {
    const idx = round.formsAnswers.findIndex((a) => a === text)
    if (idx >= 0 && (round.formsAnswersIrregulars[idx] ?? false)) return true
  }
  return false
}

function showAllSectionHasAnyIrregular(round: Round): boolean {
  if (round.answerIrregular) return true
  if (round.isConjugation) {
    return conjugationKeys.some((k) => round.conjugationAnswersIrregulars[k])
  }
  if (round.isForms) {
    return round.formsAnswersIrregulars.some(Boolean)
  }
  return false
}

function DetailAnswerBlock({
  label,
  content,
  irregular,
}: {
  label?: string
  content: string
  irregular: boolean
}) {
  return (
    <div className="space-y-0.5">
      {label ? <p className="text-sm italic opacity-80">{label}</p> : null}
      <div className="flex items-start gap-2">
        <span className="mt-1 flex w-7 shrink-0 justify-center">
          {irregular ? (
            <ExclamationTriangleIcon className="size-7 text-text-warning" aria-hidden />
          ) : null}
        </span>
        <p className="min-w-0 flex-1 text-2xl font-semibold whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  )
}

type AnswerDetailsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  text: string
  round: Round
  personsLabels: Conjugation
  formsLabels: string[]
}

export default function AnswerDetails({
  open,
  onOpenChange,
  title,
  text,
  round,
  personsLabels,
  formsLabels,
}: AnswerDetailsProps) {
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (open) {
      setShowAll(false)
    }
  }, [open])

  const mainIrregular = isMainDisplayedTextIrregular(round, text)
  const showIrregularLegend =
    mainIrregular || (showAll && showAllSectionHasAnyIrregular(round))

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={title}>
      <div className="flex items-start gap-2">
        {mainIrregular ? (
          <ExclamationTriangleIcon
            className="mt-1 size-7 shrink-0 text-text-warning"
            aria-hidden
          />
        ) : null}
        <p className="min-w-0 flex-1 text-2xl font-semibold whitespace-pre-wrap break-words">{text}</p>
      </div>

      <label className="mt-3 mb-4 flex cursor-pointer items-center gap-3 text-sm font-medium">
        <Switch.Root
          checked={showAll}
          onCheckedChange={setShowAll}
          className="relative h-6 w-11 rounded-full bg-primary-darkest transition-colors data-[state=checked]:bg-primary-text"
        >
          <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-[22px]" />
        </Switch.Root>
        {ui.answerDetails.showAll}
      </label>

      {showAll ? (
        <div className="space-y-2">
          <DetailAnswerBlock label={ui.answerDetails.question} content={round.question} irregular={false} />
          <DetailAnswerBlock
            label={ui.answerDetails.answer}
            content={round.answer}
            irregular={round.answerIrregular}
          />
          {round.isConjugation
            ? conjugationKeys.map((k) => (
                <DetailAnswerBlock
                  key={k}
                  label={personsLabels[k]}
                  content={round.conjugationAnswers[k]}
                  irregular={round.conjugationAnswersIrregulars[k]}
                />
              ))
            : null}
          {round.isForms
            ? round.formsAnswers.map((formAnswer, index) => (
                <DetailAnswerBlock
                  key={`form-${index}`}
                  label={formsLabels[index] ?? ui.cards.formFallback(index)}
                  content={formAnswer}
                  irregular={round.formsAnswersIrregulars[index] ?? false}
                />
              ))
            : null}
        </div>
      ) : null}

      {showIrregularLegend ? (
        <div className="mt-4 flex gap-2 border-t border-primary-darkest pt-4 text-sm leading-snug opacity-90">
          <ExclamationTriangleIcon
            className="mt-0.5 size-4 shrink-0 text-text-warning"
            aria-hidden
          />
          <p>{ui.answerDetails.irregularMarkLegend}</p>
        </div>
      ) : null}
    </Sheet>
  )
}
