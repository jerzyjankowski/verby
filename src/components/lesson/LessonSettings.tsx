import { useState } from 'react'
import { ArrowLeftIcon, GearIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../shared/Toast.tsx'
import Button from '../shared/Button.tsx'
import Sheet from '../shared/Sheet.tsx'
import ConfigSummary from './settings/ConfigSummary.tsx'
import Confirmation from './settings/Confirmation.tsx'
import type { LessonSave } from '../../types/config.ts'

type LessonSettingsProps = {
  lesson: LessonSave
  verbsCount: number
}

type SettingsView = 'menu' | 'config-summary' | 'close-questions'

export default function LessonSettings({ lesson, verbsCount }: LessonSettingsProps) {
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

  const titleByView: Record<SettingsView, string> = {
    menu: 'Lesson settings',
    'config-summary': 'Config Summary',
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
            <Button label="Reverse Questions" onClick={handleReverseQuestions} />
            <Button label="Close Questions" onClick={() => setView('close-questions')} />
          </div>
        ) : null}

        {view === 'config-summary' ? <ConfigSummary lesson={lesson} verbsCount={verbsCount} /> : null}

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
