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

type RemoveFromSaveViewProps = {
  language: Language
  lesson: LessonSave
  /** Verb id for the “Current verb” scope (card on screen); omit when unknown. */
  currentVerbId?: number
  onRemove?: (payload: { name: string; notes: string; whichVerbs: LibraryVerbScope }) => void
}

export default function RemoveFromSaveView({ language, lesson, currentVerbId, onRemove }: RemoveFromSaveViewProps) {
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

  const currentVerbInLesson = useMemo(
    () => currentVerbId != null && lesson.verbs.includes(currentVerbId),
    [currentVerbId, lesson.verbs],
  )

  useEffect(() => {
    if (whichVerbs === 'not_learnt' && scopeCounts.notLearnt === 0) setWhichVerbs('all')
    if (whichVerbs === 'learnt' && scopeCounts.learnt === 0) setWhichVerbs('all')
    if (whichVerbs === 'current_verb' && !currentVerbInLesson) setWhichVerbs('all')
  }, [whichVerbs, scopeCounts.notLearnt, scopeCounts.learnt, currentVerbInLesson])

  const verbScopeDropdownItems = useMemo(
    () =>
      getLibraryVerbScopeMenuSpec(scopeCounts, {
        includeCurrentVerb: true,
        currentVerbInLesson,
      }).map(({ key, label, disabled }) => ({
        key,
        label,
        disabled,
        onSelect: () => setWhichVerbs(key),
      })),
    [scopeCounts, currentVerbInLesson],
  )

  const notesAtLimit = notes.length >= LIBRARY_SAVE_NOTES_MAX_LEN
  const hasVerbsForScope = buildLessonSaveForLibrary(lesson, whichVerbs, currentVerbId) != null

  const baselineDescription = useMemo(() => {
    if (!selectedName) return ''
    return getLibraryLessonByName(language, selectedName)?.description ?? ''
  }, [language, selectedName])

  const notesChanged = notes.trim() !== baselineDescription.trim()
  const canApply =
    selectedName.trim().length > 0 && (hasVerbsForScope || notesChanged)

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker p-4 text-sm text-primary-text">
      <div>
        <p className="text-lg font-semibold">Remove from library save</p>
        <p className="mt-1 text-primary-text/80">
          Remove from an existing save every verb that also appears in this lesson (for the verb set you pick
          below). Verbs in that save that are not in this lesson stay unchanged. You can update the notes as
          well.
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
          aria-describedby={notesAtLimit ? 'library-remove-from-notes-limit' : undefined}
        />
        {notesAtLimit ? (
          <p id="library-remove-from-notes-limit" className="text-sm font-normal text-text-warning">
            Maximum notes length ({LIBRARY_SAVE_NOTES_MAX_LEN} characters) reached.
          </p>
        ) : null}
      </label>

      <div className="flex flex-col gap-1.5 text-sm font-medium">
        <Dropdown
          label="Which verbs (from this lesson)"
          items={verbScopeDropdownItems}
          selectedLabel={getLibraryVerbScopeTriggerLabel(whichVerbs, scopeCounts)}
          placeholder="Choose which verbs…"
          triggerVariant="onDark"
        />
        {!hasVerbsForScope ? (
          <p className="text-sm font-normal text-text-warning" role="status">
            No verbs match this filter. Choose another option, update progress in the lesson, or save to update
            notes only.
          </p>
        ) : null}
      </div>

      <Button
        label="Save"
        main
        disabled={!canApply}
        onClick={() =>
          onRemove?.({ name: selectedName.trim(), notes: notes.trim(), whichVerbs })
        }
      />
    </div>
  )
}
