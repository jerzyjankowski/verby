import { useState } from 'react'

import Button from '../../../shared/Button.tsx'
import TextArea from '../../../shared/TextArea.tsx'
import TextField from '../../../shared/TextField.tsx'

type CreateNewSaveViewProps = {
  onSave?: (payload: { name: string; notes: string }) => void
}

export default function CreateNewSaveView({ onSave }: CreateNewSaveViewProps) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  const canSave = name.trim().length > 0

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
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Week 3 irregular verbs"
          autoComplete="off"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>Notes</span>
        <TextArea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional details about this save…"
          rows={4}
        />
      </label>

      <Button
        label="Save"
        main
        disabled={!canSave}
        title={!canSave ? 'Enter a name to save.' : undefined}
        onClick={() => onSave?.({ name: name.trim(), notes: notes.trim() })}
      />
    </div>
  )
}
