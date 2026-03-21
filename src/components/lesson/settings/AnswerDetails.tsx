import { useEffect, useState } from 'react'
import * as Switch from '@radix-ui/react-switch'

import type { Round } from '../../../types/lesson.ts'
import type { Conjugation } from '../../../types/verb.ts'
import Sheet from '../../shared/Sheet.tsx'

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={title}>
      <p className="text-2xl font-semibold whitespace-pre-wrap break-words">{text}</p>

      <label className="mt-3 mb-4 flex cursor-pointer items-center gap-3 text-sm font-medium">
        <Switch.Root
          checked={showAll}
          onCheckedChange={setShowAll}
          className="relative h-6 w-11 rounded-full bg-primary-darkest transition-colors data-[state=checked]:bg-primary-text"
        >
          <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-[22px]" />
        </Switch.Root>
        Show all
      </label>

      {showAll ? (
        <div className="space-y-2">
          <div className="space-y-0.5">
            <p className="text-sm italic opacity-80">Question</p>
            <p className="text-2xl font-semibold whitespace-pre-wrap break-words">{round.question}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm italic opacity-80">Answer</p>
            <p className="text-2xl font-semibold whitespace-pre-wrap break-words">{round.answer}</p>
          </div>
          {round.isConjugation ? (
            <>
              <div className="space-y-0.5">
                <p className="text-sm italic opacity-80">{personsLabels.s1}</p>
                <p className="text-2xl font-semibold whitespace-pre-wrap break-words">{round.conjugationAnswers.s1}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm italic opacity-80">{personsLabels.s2}</p>
                <p className="text-2xl font-semibold whitespace-pre-wrap break-words">{round.conjugationAnswers.s2}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm italic opacity-80">{personsLabels.s3}</p>
                <p className="text-2xl font-semibold whitespace-pre-wrap break-words">{round.conjugationAnswers.s3}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm italic opacity-80">{personsLabels.p1}</p>
                <p className="text-2xl font-semibold whitespace-pre-wrap break-words">{round.conjugationAnswers.p1}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm italic opacity-80">{personsLabels.p2}</p>
                <p className="text-2xl font-semibold whitespace-pre-wrap break-words">{round.conjugationAnswers.p2}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm italic opacity-80">{personsLabels.p3}</p>
                <p className="text-2xl font-semibold whitespace-pre-wrap break-words">{round.conjugationAnswers.p3}</p>
              </div>
            </>
          ) : null}
          {round.isForms
            ? round.formsAnswers.map((formAnswer, index) => (
                <div key={`form-${index}`} className="space-y-0.5">
                  <p className="text-sm italic opacity-80">{formsLabels[index] ?? `Form ${index + 1}`}</p>
                  <p className="text-2xl font-semibold whitespace-pre-wrap break-words">{formAnswer}</p>
                </div>
              ))
            : null}
        </div>
      ) : null}
    </Sheet>
  )
}
