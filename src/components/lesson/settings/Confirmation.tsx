import Button from '../../shared/Button.tsx'

type ConfirmationProps = {
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
}

export default function Confirmation({
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
}: ConfirmationProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-primary-text">{message}</p>
      <div className="flex gap-2">
        <Button label={cancelLabel} onClick={onCancel} />
        <Button label={confirmLabel} onClick={onConfirm} main />
      </div>
    </div>
  )
}
