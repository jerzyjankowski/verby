import { useParams } from 'react-router-dom'
import { CheckIcon, ArrowRightIcon } from '@radix-ui/react-icons'

import Cards from '../../../components/lesson/Cards'
import LessonSettings from '../../../components/lesson/LessonSettings.tsx'
import Button from '../../../components/shared/Button.tsx'
import { useToast } from '../../../components/shared/Toast.tsx'
import { useLesson } from '../../../hooks/useLesson.ts'

export default function Page() {
  const { name } = useParams<{ name: string }>()
  const { lesson, verbs, round, updateRoundHiddenFlags, canContinue } = useLesson(name)
  const toast = useToast()

  console.log('[JJ]verbs:', verbs)
  console.log('[JJ]lesson:', lesson)
  console.log('[JJ]round:', round)
  console.log('[JJ]canRate:', canContinue)

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
    <div className="h-dvh bg-primary text-primary-text p-4">
      <div className="mx-auto flex h-full max-w-2xl flex-col gap-3">
        <LessonSettings lesson={lesson} verbsCount={verbs.length} />

        {round && (
          <Cards
            round={round}
            updateRoundHiddenFlags={updateRoundHiddenFlags}
          />
        )}

        {round && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              icon={<ArrowRightIcon className="size-5" />}
              rounded={false}
              onClick={() => toast.success('Next', 'Moved to next round.')}
              disabled={!canContinue}
            />
            <Button
              icon={<CheckIcon className="size-5" />}
              rounded={false}
              main
              onClick={() => toast.success('Learnt', 'Marked as learnt.')}
              disabled={!canContinue}
            />
          </div>
        )}
      </div>
    </div>
  )
}
