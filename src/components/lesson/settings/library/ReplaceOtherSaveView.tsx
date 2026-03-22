import { useEffect, useMemo, useState } from 'react'

import { LIBRARY_SAVE_NOTES_MAX_LEN, type LibraryVerbScope } from '../../../../consts/librarySave.ts'
import type { Language, LessonSave } from '../../../../types/config.ts'
import {
  buildLessonSaveForLibrary,
  getLibraryLessonByName,
  getLibraryLessonNames,
  getLibraryVerbScopeCounts,
  getLibraryVerbScopeMenuSpec,
  getLibraryVerbScopeTriggerLabel,
} from '../../../../utils/library.ts'
import { ui } from '../../../../locales'
import Button from '../../../shared/Button.tsx'
import Dropdown from '../../../shared/Dropdown.tsx'
import TextArea from '../../../shared/TextArea.tsx'

type ReplaceOtherSaveViewProps = {
  language: Language
  lesson: LessonSave
  onSave?: (payload: { name: string; notes: string; whichVerbs: LibraryVerbScope }) => void
}

export default function ReplaceOtherSaveView({ language, lesson, onSave }: ReplaceOtherSaveViewProps) {
  const [selectedName, setSelectedName] = useState('')
  const [notes, setNotes] = useState('')
  const [whichVerbs, setWhichVerbs] = useState<LibraryVerbScope>('all')

  const existingNames = useMemo(() => getLibraryLessonNames(language), [language])

  const dropdownItems = useMemo(
    () =>
      existingNames.map((name) => ({
        key: name,
        label: name,
        onSelect: () => {
          setSelectedName(name)
          const entry = getLibraryLessonByName(language, name)
          setNotes(entry?.description ?? '')
        },
      })),
    [existingNames, language],
  )

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

  const notesAtLimit = notes.length >= LIBRARY_SAVE_NOTES_MAX_LEN
  const hasVerbsForScope = buildLessonSaveForLibrary(lesson, whichVerbs) != null
  const canSave = selectedName.trim().length > 0 && hasVerbsForScope

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker p-4 text-sm text-primary-text">
      <div>
        <p className="text-lg font-semibold">{ui.libraryForms.replaceTitle}</p>
        <p className="mt-1 text-primary-text/80">{ui.libraryForms.replaceSubtitle}</p>
      </div>

      {existingNames.length === 0 ? (
        <p className="text-primary-text/80">{ui.libraryForms.noSavesYet}</p>
      ) : (
        <div className="flex flex-col gap-1.5 text-sm font-medium">
          <span>{ui.libraryForms.existingSave}</span>
          <Dropdown
            items={dropdownItems}
            selectedLabel={selectedName}
            placeholder={ui.libraryForms.chooseSavePlaceholder}
            triggerVariant="onDark"
          />
        </div>
      )}

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>{ui.libraryForms.notes}</span>
        <TextArea
          value={notes}
          maxLength={LIBRARY_SAVE_NOTES_MAX_LEN}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={ui.libraryForms.optionalDetailsPlaceholder}
          rows={4}
          disabled={existingNames.length === 0 || !selectedName}
          aria-describedby={notesAtLimit ? 'library-replace-other-notes-limit' : undefined}
        />
        {notesAtLimit ? (
          <p id="library-replace-other-notes-limit" className="text-sm font-normal text-text-warning">
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
        onClick={() =>
          onSave?.({ name: selectedName.trim(), notes: notes.trim(), whichVerbs })
        }
      />
    </div>
  )
}
