import { useMemo, useState } from 'react'
import { ArrowLeftIcon, CheckIcon, Cross2Icon, GearIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../shared/Toast.tsx'
import Button from '../shared/Button.tsx'
import Sheet from '../shared/Sheet.tsx'
import ConfigSummary from './settings/ConfigSummary.tsx'
import Confirmation from './settings/Confirmation.tsx'
import HistoryView from './settings/HistoryView.tsx'
import type { LessonSave } from '../../types/config.ts'
import type {Verb} from "../../types/verb.ts";

type LessonSettingsProps = {
  lesson: LessonSave
  verbs: Verb[]
  lastVerbsIds: number[]
}

type SettingsView = 'menu' | 'config-summary' | 'verbs' | 'history' | 'close-questions'

export default function LessonSettings({ lesson, verbs, lastVerbsIds }: LessonSettingsProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [view, setView] = useState<SettingsView>('menu')

  const handleOpenChange = (open: boolean) => {
    setSettingsOpen(open)
    if (!open) {
      setView('menu')
    }
  }

  const handleOpenSettings = () => {
    setView('menu')
    setSettingsOpen(true)
  }

  const handleBackToMenu = () => {
    setView('menu')
  }

  const handleReverseQuestions = () => {
    toast.success('Reverse Questions', 'Reversing questions is ready.')
    setSettingsOpen(false)
    setView('menu')
  }

  const handleConfirmCloseQuestions = () => {
    setSettingsOpen(false)
    setView('menu')
    navigate('/lesson')
  }

  const verbRows = useMemo(() => {
    const verbsById = new Map(verbs.map((verb) => [verb.id, verb]))

    return lesson.verbs
      .map((id, index) => ({
        id,
        verb: verbsById.get(id)?.verb ?? '-',
        repeated: lesson.repeated[index] ?? 0,
        learnt: lesson.learnt[index] ?? false,
      }))
      .sort((a, b) => a.id - b.id)
  }, [lesson, verbs])

  const titleByView: Record<SettingsView, string> = {
    menu: 'Lesson settings',
    'config-summary': 'Config Summary',
    verbs: `Verbs (${lesson.verbs.length})`,
    history: `History (${lastVerbsIds.length})`,
    'close-questions': 'Close Questions',
  }

  return (
    <>
      <div className="mb-3 flex justify-end">
        <Button
          aria-label="Open lesson settings"
          title="Settings"
          onClick={handleOpenSettings}
          icon={<GearIcon className="size-5" />}
          fullWidth={false}
          rounded
        />
      </div>

      <Sheet
        open={settingsOpen}
        onOpenChange={handleOpenChange}
        title={titleByView[view]}
        headerAction={
          view === 'menu'
            ? undefined
            : {
                ariaLabel: 'Back to settings',
                title: 'Back',
                onAction: handleBackToMenu,
                icon: <ArrowLeftIcon className="size-4" />,
              }
        }
      >
        {view === 'menu' ? (
          <div className="flex flex-col gap-2">
            <Button label="Config Summary" onClick={() => setView('config-summary')} />
            <Button label={`Verbs (${lesson.verbs.length})`} onClick={() => setView('verbs')} />
            <Button label={`History (${lastVerbsIds.length})`} onClick={() => setView('history')} />
            <Button label="Reverse Questions" onClick={handleReverseQuestions} />
            <Button label="Close Questions" onClick={() => setView('close-questions')} />
          </div>
        ) : null}

        {view === 'config-summary' ? <ConfigSummary lesson={lesson} /> : null}

        {view === 'verbs' ? (
          <div className="overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker">
            <table className="w-full text-left text-sm">
              <tbody>
                {verbRows.map((row) => (
                  <tr key={row.id} className="border-b border-primary-darkest last:border-b-0">
                    <td className="px-3 py-2 tabular-nums">{row.id}</td>
                    <td className="px-3 py-2">{row.verb}</td>
                    <td className="w-px whitespace-nowrap px-3 py-2 text-right tabular-nums">×{row.repeated}</td>
                    <td className="w-px whitespace-nowrap px-3 py-2">
                      {row.learnt ? (
                        <CheckIcon aria-label="Learnt" className="size-4" />
                      ) : (
                        <Cross2Icon aria-label="Not learnt" className="size-4" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {view === 'history' ? <HistoryView lesson={lesson} verbs={verbs} lastVerbsIds={lastVerbsIds} /> : null}

        {view === 'close-questions' ? (
          <Confirmation
            message="Are you sure you want to close this lesson and return to the lessons page?"
            onConfirm={handleConfirmCloseQuestions}
            onCancel={handleBackToMenu}
          />
        ) : null}
      </Sheet>
    </>
  )
}
