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
import RemoveFromSaveView from './settings/library/RemoveFromSaveView.tsx'
import ReplaceOtherSaveView from './settings/library/ReplaceOtherSaveView.tsx'
import { LIBRARY_VIEW_TITLES, ui } from '../../locales/index.ts'
import type { LibrarySettingsView } from '../../types/library.ts'
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
import { MAIN_PAGE_URL } from "../../consts/urls.ts";

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
    navigate(MAIN_PAGE_URL)
  }

  const handleQuickSave = () => {
    saveLessonAsCurrentToLocalStorage(lesson)
    toast.success(ui.toast.quickSaveTitle, ui.toast.quickSaveBody)
  }

  const notLearntCount = lesson.verbs.reduce(
    (count, _id, index) => count + (lesson.learnt[index] ? 0 : 1),
    0,
  )
  const verbsLabel = ui.lesson.verbsLabel(notLearntCount, lesson.verbs.length)

  const editVerbLabel = currentVerb
    ? ui.lesson.editVerbWithName(currentVerb.verb)
    : ui.lesson.editVerb

  const titleByView: Record<SettingsView, string> = {
    menu: ui.lesson.settingsMenuTitle,
    'config-summary': ui.lesson.configSummaryTitle,
    'library-management': ui.lesson.manageLibrary,
    ...LIBRARY_VIEW_TITLES,
    verbs: verbsLabel,
    'verb-edit': ui.lesson.editVerb,
    history: ui.lesson.historyLabel(lastVerbsIds.length),
    'close-questions': ui.lesson.closeQuestionsTitle,
    'reverse-direction': ui.lesson.reverseDirectionTitle,
    'restart-questions': ui.lesson.restartQuestionsTitle,
  }

  const sheetTitle =
    currentView === 'verb-edit' && verbBeingEdited
      ? ui.lesson.editVerbWithName(verbBeingEdited.verb)
      : titleByView[currentView]

  return (
    <>
      <Button
        aria-label={ui.aria.openLessonSettings}
        title={ui.aria.settings}
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
                ariaLabel: ui.aria.backToPreviousScreen,
                title: ui.common.back,
                onAction: handleBack,
                icon: <ArrowLeftIcon className="size-4" />,
              }
        }
      >
        {currentView === 'menu' ? (
          <div className="flex flex-col gap-2">
            <Button label={ui.lesson.configSummaryButton} onClick={() => pushView('config-summary')} />
            <Button label={ui.lesson.manageLibraryButton} onClick={() => pushView('library-management')} />
            <Button label={ui.lesson.quickSave} onClick={handleQuickSave} />
            <Button label={verbsLabel} onClick={() => pushView('verbs')} />
            <Button
              label={editVerbLabel}
              onClick={() => openVerbEdit(currentVerb)}
              disabled={!currentVerb}
            />
            <Button
              label={ui.lesson.historyLabel(lastVerbsIds.length)}
              onClick={() => pushView('history')}
            />
            <Button label={ui.lesson.reverseDirection} onClick={() => pushView('reverse-direction')} />
            <Button label={ui.lesson.restartQuestions} onClick={() => pushView('restart-questions')} />
            <Button label={ui.lesson.closeQuestions} onClick={() => pushView('close-questions')} />
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
              toast.success(ui.toast.libraryTitle, ui.toast.lessonSavedToLibrary)
              handleBack()
            }}
          />
        ) : null}
        {currentView === 'library-add-to-other' ? (
          <AddToOtherSaveView
            language={lesson.config.language}
            lesson={lesson}
            currentVerbId={currentVerb?.id}
            onSave={async ({ name, notes, whichVerbs }) => {
              const snapshot = buildLessonSaveForLibrary(lesson, whichVerbs, currentVerb?.id)
              try {
                const result = await mergeIntoLibraryEntry(lesson.config.language, name, snapshot, notes)
                if (!result) return
                const { addedVerbCount } = result
                toast.success(ui.toast.libraryTitle, ui.lesson.toastAddedVerbs(addedVerbCount))
                handleBack()
              } catch {
                toast.error(ui.toast.libraryTitle, ui.toast.mergeVerbsError)
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
              toast.success(ui.toast.libraryTitle, ui.toast.librarySaveReplaced)
              handleBack()
            }}
          />
        ) : null}
        {currentView === 'library-remove-from' ? (
          <RemoveFromSaveView
            language={lesson.config.language}
            lesson={lesson}
            currentVerbId={currentVerb?.id}
            onRemove={async ({ name, notes, whichVerbs }) => {
              const snapshot = buildLessonSaveForLibrary(lesson, whichVerbs, currentVerb?.id)
              try {
                const result = await removeMatchingVerbsFromLibraryEntry(
                  lesson.config.language,
                  name,
                  snapshot,
                  notes,
                )
                if (!result) return
                const { removedVerbCount } = result
                toast.success(ui.toast.libraryTitle, ui.lesson.toastRemovedVerbs(removedVerbCount))
                handleBack()
              } catch {
                toast.error(ui.toast.libraryTitle, ui.toast.updateLevelsError)
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
            message={ui.lesson.confirmCloseLesson}
            onConfirm={handleConfirmCloseQuestions}
            onCancel={handleBack}
          />
        ) : null}

        {currentView === 'reverse-direction' ? (
          <Confirmation
            message={ui.lesson.confirmReverseDirection}
            onConfirm={handleConfirmReverseDirection}
            onCancel={handleBack}
          />
        ) : null}

        {currentView === 'restart-questions' ? (
          <Confirmation
            message={ui.lesson.confirmRestart}
            onConfirm={handleConfirmRestartQuestions}
            onCancel={handleBack}
          />
        ) : null}
      </Sheet>
    </>
  )
}
