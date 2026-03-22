import { useEffect, useMemo, useState } from 'react'

import {
  LIBRARY_SAVE_NAME_MAX_LEN,
  LIBRARY_SAVE_NOTES_MAX_LEN,
  type LibraryVerbScope,
} from '../../../../consts/librarySave.ts'
import type { Language, LessonSave } from '../../../../types/config.ts'
import {
  buildLessonSaveForLibrary,
  getLibraryLessonNames,
  getLibraryVerbScopeCounts,
  getLibraryVerbScopeMenuSpec,
  getLibraryVerbScopeTriggerLabel,
} from '../../../../utils/library.ts'
import { ui } from '../../../../locales'
import Button from '../../../shared/Button.tsx'
import Dropdown from '../../../shared/Dropdown.tsx'
import TextArea from '../../../shared/TextArea.tsx'
import TextField from '../../../shared/TextField.tsx'

type CreateNewSaveViewProps = {
  language: Language
  lesson: LessonSave
  onSave?: (payload: { name: string; notes: string; whichVerbs: LibraryVerbScope }) => void
}

export default function CreateNewSaveView({ language, lesson, onSave }: CreateNewSaveViewProps) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [whichVerbs, setWhichVerbs] = useState<LibraryVerbScope>('all')

  const trimmedName = name.trim()
  const existingNames = useMemo(() => getLibraryLessonNames(language), [language])

  const nameTaken = useMemo(() => {
    const key = trimmedName.toLowerCase()
    return key.length > 0 && existingNames.some((n) => n.toLowerCase() === key)
  }, [trimmedName, existingNames])
  const nameAtLimit = name.length >= LIBRARY_SAVE_NAME_MAX_LEN
  const notesAtLimit = notes.length >= LIBRARY_SAVE_NOTES_MAX_LEN
  const hasVerbsForScope = buildLessonSaveForLibrary(lesson, whichVerbs) != null
  const canSave = trimmedName.length > 0 && !nameTaken && hasVerbsForScope

  const scopeCounts = useMemo(() => getLibraryVerbScopeCounts(lesson), [lesson])

  useEffect(() => {
    if (whichVerbs === 'not_learnt' && scopeCounts.notLearnt === 0) setWhichVerbs('all')
    if (whichVerbs === 'learnt' && scopeCounts.learnt === 0) setWhichVerbs('all')
  }, [whichVerbs, scopeCounts.notLearnt, scopeCounts.learnt])

  const verbScopeDropdownItems = useMemo(
    () =>
      getLibraryVerbScopeMenuSpec(scopeCounts).map(({ key, label, disabled }) => ({
        key,
        label,
        disabled,
        onSelect: () => setWhichVerbs(key),
      })),
    [scopeCounts],
  )

  const nameDescribedBy = [
    nameTaken ? 'library-new-save-name-error' : null,
    nameAtLimit ? 'library-new-save-name-limit' : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker p-4 text-sm text-primary-text">
      <div>
        <p className="text-lg font-semibold">{ui.libraryForms.newTitle}</p>
        <p className="mt-1 text-primary-text/80">{ui.libraryForms.newSubtitle}</p>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>{ui.libraryPage.nameLabel}</span>
        <TextField
          type="text"
          value={name}
          maxLength={LIBRARY_SAVE_NAME_MAX_LEN}
          onChange={(e) => setName(e.target.value)}
          placeholder={ui.libraryForms.namePlaceholderExample}
          autoComplete="off"
          aria-invalid={nameTaken}
          aria-describedby={nameDescribedBy || undefined}
        />
        {nameTaken ? (
          <p id="library-new-save-name-error" className="text-sm font-normal text-text-error" role="alert">
            {ui.libraryForms.nameTaken}
          </p>
        ) : null}
        {nameAtLimit ? (
          <p id="library-new-save-name-limit" className="text-sm font-normal text-text-warning">
            {ui.libraryForms.nameMaxLengthReached(LIBRARY_SAVE_NAME_MAX_LEN)}
          </p>
        ) : null}
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>{ui.libraryForms.notes}</span>
        <TextArea
          value={notes}
          maxLength={LIBRARY_SAVE_NOTES_MAX_LEN}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={ui.libraryForms.optionalDetailsPlaceholder}
          rows={4}
          aria-describedby={notesAtLimit ? 'library-new-save-notes-limit' : undefined}
        />
        {notesAtLimit ? (
          <p id="library-new-save-notes-limit" className="text-sm font-normal text-text-warning">
            {ui.libraryForms.notesMaxLengthReached(LIBRARY_SAVE_NOTES_MAX_LEN)}
          </p>
        ) : null}
      </label>

      <div className="flex flex-col gap-1.5 text-sm font-medium">
        <Dropdown
          label={ui.libraryForms.whichVerbs}
          items={verbScopeDropdownItems}
          selectedLabel={getLibraryVerbScopeTriggerLabel(whichVerbs, scopeCounts)}
          placeholder={ui.libraryForms.chooseVerbsPlaceholder}
          triggerVariant="onDark"
        />
        {!hasVerbsForScope ? (
          <p className="text-sm font-normal text-text-warning" role="status">
            {ui.libraryForms.noVerbsMatchSimple}
          </p>
        ) : null}
      </div>

      <Button
        label={ui.common.save}
        main
        disabled={!canSave}
        onClick={() => onSave?.({ name: trimmedName, notes: notes.trim(), whichVerbs })}
      />
    </div>
  )
}
