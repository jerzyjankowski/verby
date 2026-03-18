import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'

export type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export default function Modal({ open, onOpenChange, title, children, footer }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-verby-secondary bg-verby-bg p-4 text-verby-text shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close modal"
                className="rounded-md border border-verby-secondary/60 bg-verby-bg px-2 py-1 text-sm hover:bg-verby-secondary/30"
              >
                Close
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-3">{children}</div>

          {footer ? <div className="mt-4">{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

