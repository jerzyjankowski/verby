import type { ReactNode } from 'react'

import Button from '../../shared/Button.tsx'

type ConfirmationProps = {
  message: ReactNode
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
  confirmDisabled?: boolean
}

export default function Confirmation({
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  confirmDisabled = false,
}: ConfirmationProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm text-primary-text">{message}</div>
      <div className="flex gap-2">
        <Button label={cancelLabel} onClick={onCancel} />
        <Button label={confirmLabel} onClick={onConfirm} main disabled={confirmDisabled} />
      </div>
    </div>
  )
}
