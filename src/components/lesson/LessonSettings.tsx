import { useCallback, useState } from 'react'
import { ArrowLeftIcon, GearIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

import Button from '../shared/Button.tsx'
import Sheet from '../shared/Sheet.tsx'
import { useToast } from '../shared/Toast.tsx'
import ConfigSummary from './settings/ConfigSummary.tsx'
import Confirmation from './settings/Confirmation.tsx'
import HistoryView from './settings/HistoryView.tsx'
import AddToOtherSaveView from './settings/library/AddToOtherSaveView.tsx'
import CreateNewSaveView from './settings/library/CreateNewSaveView.tsx'
import EditCurrentSaveView from './settings/library/EditCurrentSaveView.tsx'
import RemoveFromSaveView from './settings/library/RemoveFromSaveView.tsx'
import ReplaceOtherSaveView from './settings/library/ReplaceOtherSaveView.tsx'
import { LIBRARY_VIEW_TITLES, type LibrarySettingsView } from '../../types/library.ts'
import LibraryManagement from './settings/LibraryManagement.tsx'
import VerbsView from './settings/VerbsView.tsx'
import VerbView from './settings/VerbView.tsx'
import type {LanguageConfig, LessonSave} from '../../types/config.ts'
import type {Verb} from "../../types/verb.ts";
import {
  buildLessonSaveForLibrary,
  mergeIntoLibraryEntry,
  removeMatchingVerbsFromLibraryEntry,
  saveLibraryEntry,
} from '../../utils/library.ts'
import { saveLessonAsCurrentToLocalStorage } from '../../utils/localStorage.ts'
import {PREPARE_LESSON_PAGE_URL} from "../../consts/urls.ts";

type LessonSettingsProps = {
  lesson: LessonSave
  verbs: Verb[]
  lastVerbsIds: number[]
  languageConfig: LanguageConfig
  currentVerb?: Verb
  onVerbLearntChange: (verbId: number, learnt: boolean) => void
  onReverseDirection: () => void
  onRestartQuestions: () => void
}

type SettingsView =
  | 'menu'
  | 'config-summary'
  | 'library-management'
  | LibrarySettingsView
  | 'verbs'
  | 'verb-edit'
  | 'history'
  | 'close-questions'
  | 'reverse-direction'
  | 'restart-questions'

export default function LessonSettings({
  lesson,
  verbs,
  lastVerbsIds,
  languageConfig,
  currentVerb,
  onVerbLearntChange,
  onReverseDirection,
  onRestartQuestions,
}: LessonSettingsProps) {
  const navigate = useNavigate()
  const toast = useToast()
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

  const handleConfirmRestartQuestions = () => {
    onRestartQuestions()
    handleBack()
  }

  const handleConfirmCloseQuestions = () => {
    setSettingsOpen(false)
    resetNavigation()
    navigate(PREPARE_LESSON_PAGE_URL)
  }

  const handleQuickSave = () => {
    saveLessonAsCurrentToLocalStorage(lesson)
    toast.success('Quick save', 'Current lesson quick saved')
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
    'library-management': 'Manage library',
    ...LIBRARY_VIEW_TITLES,
    verbs: verbsLabel,
    'verb-edit': 'Edit verb',
    history: `History (${lastVerbsIds.length})`,
    'close-questions': 'Close Questions',
    'reverse-direction': 'Reverse Direction',
    'restart-questions': 'Restart Questions',
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
            <Button label="Manage Library" onClick={() => pushView('library-management')} />
            <Button label="Quick save" onClick={handleQuickSave} />
            <Button label={verbsLabel} onClick={() => pushView('verbs')} />
            <Button
              label={editVerbLabel}
              onClick={() => openVerbEdit(currentVerb)}
              disabled={!currentVerb}
            />
            <Button label={`History (${lastVerbsIds.length})`} onClick={() => pushView('history')} />
            <Button label="Reverse Direction" onClick={() => pushView('reverse-direction')} />
            <Button label="Restart questions" onClick={() => pushView('restart-questions')} />
            <Button label="Close Questions" onClick={() => pushView('close-questions')} />
          </div>
        ) : null}

        {currentView === 'config-summary' ? <ConfigSummary lesson={lesson} languageConfig={languageConfig} /> : null}

        {currentView === 'library-management' ? (
          <LibraryManagement onOpenLibraryView={pushView} />
        ) : null}

        {currentView === 'library-create-new' ? (
          <CreateNewSaveView
            language={lesson.config.language}
            lesson={lesson}
            onSave={({ name, notes, whichVerbs }) => {
              const snapshot = buildLessonSaveForLibrary(lesson, whichVerbs)
              if (!snapshot) return
              saveLibraryEntry(lesson.config.language, snapshot, name, notes)
              toast.success('Library', 'Lesson saved to your library.')
              handleBack()
            }}
          />
        ) : null}
        {currentView === 'library-edit-current' ? <EditCurrentSaveView /> : null}
        {currentView === 'library-add-to-other' ? (
          <AddToOtherSaveView
            language={lesson.config.language}
            lesson={lesson}
            onSave={async ({ name, notes, whichVerbs }) => {
              const snapshot = buildLessonSaveForLibrary(lesson, whichVerbs)
              try {
                const result = await mergeIntoLibraryEntry(lesson.config.language, name, snapshot, notes)
                if (!result) return
                const { addedVerbCount } = result
                toast.success(
                  'Library',
                  addedVerbCount > 0
                    ? `Added ${addedVerbCount} verb${addedVerbCount === 1 ? '' : 's'} to the library save.`
                    : 'Library save updated.',
                )
                handleBack()
              } catch {
                toast.error('Library', 'Could not load verbs to merge levels into the library save.')
              }
            }}
          />
        ) : null}
        {currentView === 'library-replace-other' ? (
          <ReplaceOtherSaveView
            language={lesson.config.language}
            lesson={lesson}
            onSave={({ name, notes, whichVerbs }) => {
              const snapshot = buildLessonSaveForLibrary(lesson, whichVerbs)
              if (!snapshot) return
              saveLibraryEntry(lesson.config.language, snapshot, name, notes)
              toast.success('Library', 'Library save replaced with the current lesson.')
              handleBack()
            }}
          />
        ) : null}
        {currentView === 'library-remove-from' ? (
          <RemoveFromSaveView
            language={lesson.config.language}
            lesson={lesson}
            onRemove={async ({ name, notes, whichVerbs }) => {
              const snapshot = buildLessonSaveForLibrary(lesson, whichVerbs)
              try {
                const result = await removeMatchingVerbsFromLibraryEntry(
                  lesson.config.language,
                  name,
                  snapshot,
                  notes,
                )
                if (!result) return
                const { removedVerbCount } = result
                toast.success(
                  'Library',
                  removedVerbCount > 0
                    ? `Removed ${removedVerbCount} verb${removedVerbCount === 1 ? '' : 's'} from the library save.`
                    : 'Library save updated.',
                )
                handleBack()
              } catch {
                toast.error('Library', 'Could not load verbs to update levels in the library save.')
              }
            }}
          />
        ) : null}

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

        {currentView === 'restart-questions' ? (
          <Confirmation
            message="Reset learnt progress, repeat counts, and history for this session? Nothing will be written to storage."
            onConfirm={handleConfirmRestartQuestions}
            onCancel={handleBack}
          />
        ) : null}
      </Sheet>
    </>
  )
}
