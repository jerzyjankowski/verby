import { useNavigate } from 'react-router-dom'
import { CheckIcon, ArrowRightIcon } from '@radix-ui/react-icons'

import Cards from '../../components/lesson/Cards.tsx'
import LessonCelebration from '../../components/lesson/LessonCelebration.tsx'
import LessonTopBar from '../../components/lesson/LessonTopBar.tsx'
import Button from '../../components/shared/Button.tsx'
import { useLesson } from '../../hooks/useLesson.ts'
import {MAIN_PAGE_URL} from "../../consts/urls.ts";

export default function Page() {
  const navigate = useNavigate()
  const {
    lesson,
    verbs,
    round,
    lastVerbsIds,
    isCompleted,
    updateRoundHiddenFlags,
    canContinue,
    onContinue,
    languageConfig,
    setVerbLearnt,
    reverseDirection,
    restartQuestions,
    resetProgressAndSave,
    setCurrentLessonFromSave,
  } = useLesson()
  console.log('[JJ]lesson.name', lesson?.name)

  const handleComplete = () => {
    resetProgressAndSave()
    navigate(MAIN_PAGE_URL)
  }

  const currentVerb = round ? verbs.find((v) => v.id === round.verbId) : undefined

  if (!lesson) {
    return (
      <div className="min-h-screen bg-primary text-primary-text p-4">
        <p className="text-primary-text">
          No config found for lesson. Start from the init page.
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
        isCompleted={isCompleted}
        onVerbLearntChange={setVerbLearnt}
        onReverseDirection={reverseDirection}
        onRestartQuestions={restartQuestions}
        onCurrentLessonSave={setCurrentLessonFromSave}
      />
      <div
        className={`mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-3 p-4 ${isCompleted ? 'overflow-hidden' : 'overflow-auto'}`}
      >
        {isCompleted ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <LessonCelebration />
            </div>
            <Button label="Close" main onClick={handleComplete} />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
