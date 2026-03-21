import { useState } from 'react'
import { ArrowLeftIcon, GearIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../shared/Toast.tsx'
import Button from '../shared/Button.tsx'
import Sheet from '../shared/Sheet.tsx'
import ConfigSummary from './settings/ConfigSummary.tsx'
import Confirmation from './settings/Confirmation.tsx'
import HistoryView from './settings/HistoryView.tsx'
import VerbsView from './settings/VerbsView.tsx'
import type {LanguageConfig, LessonSave} from '../../types/config.ts'
import type {Verb} from "../../types/verb.ts";

type LessonSettingsProps = {
  lesson: LessonSave
  verbs: Verb[]
  lastVerbsIds: number[]
  languageConfig: LanguageConfig
}

type SettingsView = 'menu' | 'config-summary' | 'verbs' | 'history' | 'close-questions'

export default function LessonSettings({ lesson, verbs, lastVerbsIds, languageConfig }: LessonSettingsProps) {
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

  const notLearntCount = lesson.verbs.reduce(
    (count, _id, index) => count + (lesson.learnt[index] ? 0 : 1),
    0,
  )
  const verbsLabel = `Verbs (${notLearntCount}/${lesson.verbs.length})`

  const titleByView: Record<SettingsView, string> = {
    menu: 'Lesson settings',
    'config-summary': 'Config Summary',
    verbs: verbsLabel,
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
            <Button label={verbsLabel} onClick={() => setView('verbs')} />
            <Button label={`History (${lastVerbsIds.length})`} onClick={() => setView('history')} />
            <Button label="Reverse Questions" onClick={handleReverseQuestions} />
            <Button label="Close Questions" onClick={() => setView('close-questions')} />
          </div>
        ) : null}

        {view === 'config-summary' ? <ConfigSummary lesson={lesson} languageConfig={languageConfig} /> : null}

        {view === 'verbs' ? <VerbsView lesson={lesson} verbs={verbs} /> : null}

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
