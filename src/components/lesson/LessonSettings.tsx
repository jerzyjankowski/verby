import { useCallback, useState } from 'react'
import { ArrowLeftIcon, GearIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

import Button from '../shared/Button.tsx'
import Sheet from '../shared/Sheet.tsx'
import ConfigSummary from './settings/ConfigSummary.tsx'
import Confirmation from './settings/Confirmation.tsx'
import HistoryView from './settings/HistoryView.tsx'
import VerbsView from './settings/VerbsView.tsx'
import VerbView from './settings/VerbView.tsx'
import type {LanguageConfig, LessonSave} from '../../types/config.ts'
import type {Verb} from "../../types/verb.ts";

type LessonSettingsProps = {
  lesson: LessonSave
  verbs: Verb[]
  lastVerbsIds: number[]
  languageConfig: LanguageConfig
  currentVerb?: Verb
  onVerbLearntChange: (verbId: number, learnt: boolean) => void
  onReverseDirection: () => void
}

type SettingsView =
  | 'menu'
  | 'config-summary'
  | 'verbs'
  | 'verb-edit'
  | 'history'
  | 'close-questions'
  | 'reverse-direction'

export default function LessonSettings({
  lesson,
  verbs,
  lastVerbsIds,
  languageConfig,
  currentVerb,
  onVerbLearntChange,
  onReverseDirection,
}: LessonSettingsProps) {
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [viewStack, setViewStack] = useState<SettingsView[]>(['menu'])
  const [verbBeingEdited, setVerbBeingEdited] = useState<Verb | null>(null)

  const currentView = viewStack[viewStack.length - 1]!

  const pushView = useCallback((next: SettingsView) => {
    setViewStack((stack) => [...stack, next])
  }, [])

  const handleBack = useCallback(() => {
    if (currentView === 'verb-edit') {
      setVerbBeingEdited(null)
    }
    setViewStack((stack) => (stack.length <= 1 ? stack : stack.slice(0, -1)))
  }, [currentView])

  const openVerbEdit = (verb: Verb | undefined) => {
    if (!verb) return
    setVerbBeingEdited(verb)
    pushView('verb-edit')
  }

  const resetNavigation = () => {
    setViewStack(['menu'])
    setVerbBeingEdited(null)
  }

  const handleOpenChange = (open: boolean) => {
    setSettingsOpen(open)
    if (!open) {
      resetNavigation()
    }
  }

  const handleOpenSettings = () => {
    resetNavigation()
    setSettingsOpen(true)
  }

  const handleConfirmReverseDirection = () => {
    onReverseDirection()
    handleBack()
  }

  const handleConfirmCloseQuestions = () => {
    setSettingsOpen(false)
    resetNavigation()
    navigate('/lesson')
  }

  const notLearntCount = lesson.verbs.reduce(
    (count, _id, index) => count + (lesson.learnt[index] ? 0 : 1),
    0,
  )
  const verbsLabel = `Verbs (${notLearntCount}/${lesson.verbs.length})`

  const editVerbLabel = currentVerb
    ? `Edit verb (${currentVerb.verb})`
    : 'Edit verb'

  const titleByView: Record<SettingsView, string> = {
    menu: 'Lesson settings',
    'config-summary': 'Config Summary',
    verbs: verbsLabel,
    'verb-edit': 'Edit verb',
    history: `History (${lastVerbsIds.length})`,
    'close-questions': 'Close Questions',
    'reverse-direction': 'Reverse Direction',
  }

  const sheetTitle =
    currentView === 'verb-edit' && verbBeingEdited
      ? `Edit verb (${verbBeingEdited.verb})`
      : titleByView[currentView]

  return (
    <>
      <Button
        aria-label="Open lesson settings"
        title="Settings"
        onClick={handleOpenSettings}
        icon={<GearIcon className="size-5" />}
        fullWidth={false}
        rounded
      />

      <Sheet
        open={settingsOpen}
        onOpenChange={handleOpenChange}
        title={sheetTitle}
        headerAction={
          currentView === 'menu'
            ? undefined
            : {
                ariaLabel: 'Back to previous screen',
                title: 'Back',
                onAction: handleBack,
                icon: <ArrowLeftIcon className="size-4" />,
              }
        }
      >
        {currentView === 'menu' ? (
          <div className="flex flex-col gap-2">
            <Button label="Config Summary" onClick={() => pushView('config-summary')} />
            <Button label={verbsLabel} onClick={() => pushView('verbs')} />
            <Button
              label={editVerbLabel}
              onClick={() => openVerbEdit(currentVerb)}
              disabled={!currentVerb}
            />
            <Button label={`History (${lastVerbsIds.length})`} onClick={() => pushView('history')} />
            <Button label="Reverse Direction" onClick={() => pushView('reverse-direction')} />
            <Button label="Close Questions" onClick={() => pushView('close-questions')} />
          </div>
        ) : null}

        {currentView === 'config-summary' ? <ConfigSummary lesson={lesson} languageConfig={languageConfig} /> : null}

        {currentView === 'verbs' ? (
          <VerbsView
            lesson={lesson}
            verbs={verbs}
            onVerbSelect={(verbId) => openVerbEdit(verbs.find((v) => v.id === verbId))}
          />
        ) : null}

        {currentView === 'verb-edit' && verbBeingEdited ? (
          <VerbView
            lesson={lesson}
            verb={verbBeingEdited}
            onLearntChange={(learnt) => onVerbLearntChange(verbBeingEdited.id, learnt)}
          />
        ) : null}

        {currentView === 'history' ? (
          <HistoryView
            lesson={lesson}
            verbs={verbs}
            lastVerbsIds={lastVerbsIds}
            onVerbSelect={(verbId) => openVerbEdit(verbs.find((v) => v.id === verbId))}
          />
        ) : null}

        {currentView === 'close-questions' ? (
          <Confirmation
            message="Are you sure you want to close this lesson and return to the lessons page?"
            onConfirm={handleConfirmCloseQuestions}
            onCancel={handleBack}
          />
        ) : null}

        {currentView === 'reverse-direction' ? (
          <Confirmation
            message="Switch which language is shown as the question and which as the answer? The current card will update."
            onConfirm={handleConfirmReverseDirection}
            onCancel={handleBack}
          />
        ) : null}
      </Sheet>
    </>
  )
}
