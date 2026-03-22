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
        <p className="text-lg font-semibold">Replace library save</p>
        <p className="mt-1 text-primary-text/80">
          Overwrite an existing library entry with the current lesson state.
        </p>
      </div>

      {existingNames.length === 0 ? (
        <p className="text-primary-text/80">No saves in your library for this language yet.</p>
      ) : (
        <div className="flex flex-col gap-1.5 text-sm font-medium">
          <span>Existing save</span>
          <Dropdown
            items={dropdownItems}
            selectedLabel={selectedName}
            placeholder="Choose a library save…"
            triggerVariant="onDark"
          />
        </div>
      )}

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>Notes</span>
        <TextArea
          value={notes}
          maxLength={LIBRARY_SAVE_NOTES_MAX_LEN}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional details about this save…"
          rows={4}
          disabled={existingNames.length === 0 || !selectedName}
          aria-describedby={notesAtLimit ? 'library-replace-other-notes-limit' : undefined}
        />
        {notesAtLimit ? (
          <p id="library-replace-other-notes-limit" className="text-sm font-normal text-text-warning">
            Maximum notes length ({LIBRARY_SAVE_NOTES_MAX_LEN} characters) reached.
          </p>
        ) : null}
      </label>

      <div className="flex flex-col gap-1.5 text-sm font-medium">
        <Dropdown
          label="Which verbs"
          items={verbScopeDropdownItems}
          selectedLabel={getLibraryVerbScopeTriggerLabel(whichVerbs, scopeCounts)}
          placeholder="Choose which verbs…"
          triggerVariant="onDark"
        />
        {!hasVerbsForScope ? (
          <p className="text-sm font-normal text-text-warning" role="status">
            No verbs match this filter. Choose another option or update progress in the lesson.
          </p>
        ) : null}
      </div>

      <Button
        label="Save"
        main
        disabled={!canSave}
        onClick={() =>
          onSave?.({ name: selectedName.trim(), notes: notes.trim(), whichVerbs })
        }
      />
    </div>
  )
}
