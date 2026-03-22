import { useMemo, useState } from 'react'

import { LIBRARY_SAVE_NAME_MAX_LEN, LIBRARY_SAVE_NOTES_MAX_LEN } from '../../../../consts/librarySave.ts'
import type { Language } from '../../../../types/config.ts'
import { getLibraryLessonNames } from '../../../../utils/library.ts'
import Button from '../../../shared/Button.tsx'
import TextArea from '../../../shared/TextArea.tsx'
import TextField from '../../../shared/TextField.tsx'

type CreateNewSaveViewProps = {
  language: Language
  onSave?: (payload: { name: string; notes: string }) => void
}

export default function CreateNewSaveView({ language, onSave }: CreateNewSaveViewProps) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  
  const trimmedName = name.trim()
  const existingNames = useMemo(() => getLibraryLessonNames(language), [language])

  const nameTaken = useMemo(() => {
    const key = trimmedName.toLowerCase()
    return key.length > 0 && existingNames.some((n) => n.toLowerCase() === key)
  }, [trimmedName, existingNames])
  const nameAtLimit = name.length >= LIBRARY_SAVE_NAME_MAX_LEN
  const notesAtLimit = notes.length >= LIBRARY_SAVE_NOTES_MAX_LEN
  const canSave = trimmedName.length > 0 && !nameTaken

  const nameDescribedBy = [
    nameTaken ? 'library-new-save-name-error' : null,
    nameAtLimit ? 'library-new-save-name-limit' : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker p-4 text-sm text-primary-text">
      <div>
        <p className="text-lg font-semibold">New library save</p>
        <p className="mt-1 text-primary-text/80">
          Save the current lesson as a new entry in your library.
        </p>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>Name</span>
        <TextField
          type="text"
          value={name}
          maxLength={LIBRARY_SAVE_NAME_MAX_LEN}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Week 3 irregular verbs"
          autoComplete="off"
          aria-invalid={nameTaken}
          aria-describedby={nameDescribedBy || undefined}
        />
        {nameTaken ? (
          <p id="library-new-save-name-error" className="text-sm font-normal text-text-error" role="alert">
            A save with this name already exists. Choose a different name.
          </p>
        ) : null}
        {nameAtLimit ? (
          <p id="library-new-save-name-limit" className="text-sm font-normal text-text-warning">
            Maximum name length ({LIBRARY_SAVE_NAME_MAX_LEN} characters) reached.
          </p>
        ) : null}
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>Notes</span>
        <TextArea
          value={notes}
          maxLength={LIBRARY_SAVE_NOTES_MAX_LEN}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional details about this save…"
          rows={4}
          aria-describedby={notesAtLimit ? 'library-new-save-notes-limit' : undefined}
        />
        {notesAtLimit ? (
          <p id="library-new-save-notes-limit" className="text-sm font-normal text-text-warning">
            Maximum notes length ({LIBRARY_SAVE_NOTES_MAX_LEN} characters) reached.
          </p>
        ) : null}
      </label>

      <Button
        label="Save"
        main
        disabled={!canSave}
        onClick={() => onSave?.({ name: trimmedName, notes: notes.trim() })}
      />
    </div>
  )
}
