import { useParams } from 'react-router-dom'
import { CheckIcon, ArrowRightIcon } from '@radix-ui/react-icons'

import Cards from '../../../components/lesson/Cards'
import LessonTopBar from '../../../components/lesson/LessonTopBar.tsx'
import Button from '../../../components/shared/Button.tsx'
import { useLesson } from '../../../hooks/useLesson.ts'

export default function Page() {
  const { name } = useParams<{ name: string }>()
  const {
    lesson,
    verbs,
    round,
    lastVerbsIds,
    updateRoundHiddenFlags,
    canContinue,
    onContinue,
    languageConfig,
    setVerbLearnt,
  } = useLesson(name)

  const currentVerb = round ? verbs.find((v) => v.id === round.verbId) : undefined

  if (!lesson) {
    return (
      <div className="min-h-screen bg-primary text-primary-text p-4">
        <p className="text-primary-text">
          No config found for lesson "{name ?? 'unknown'}". Start from the init page.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-primary text-primary-text">
      <LessonTopBar
        lesson={lesson}
        verbs={verbs}
        lastVerbsIds={lastVerbsIds}
        languageConfig={languageConfig}
        currentVerb={currentVerb}
        onVerbLearntChange={setVerbLearnt}
      />
      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-3 overflow-auto p-4">
        {round && (
          <Cards
            round={round}
            updateRoundHiddenFlags={updateRoundHiddenFlags}
            languageConfig={languageConfig}
          />
        )}

        {round && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              icon={<ArrowRightIcon className="size-5" />}
              rounded={false}
              onClick={() => onContinue(false)}
              disabled={!canContinue}
            />
            <Button
              icon={<CheckIcon className="size-5" />}
              rounded={false}
              main
              onClick={() => onContinue(true)}
              disabled={!canContinue}
            />
          </div>
        )}
      </div>
    </div>
  )
}
