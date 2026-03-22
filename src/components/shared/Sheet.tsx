import * as Dialog from '@radix-ui/react-dialog'
import { Cross1Icon } from '@radix-ui/react-icons'
import type { ReactNode } from 'react'

import Button from './Button.tsx'
import { ui } from '../../locales'

type SheetHeaderAction = {
  ariaLabel: string
  title: string
  icon: ReactNode
  onAction: () => void
}

export type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  footer?: ReactNode
  headerAction?: SheetHeaderAction
}

export default function Sheet({
  open,
  onOpenChange,
  title,
  children,
  footer,
  headerAction,
}: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-dialog-overlay)] bg-black/60 data-[state=open]:animate-[verby-overlay-in_220ms_ease-out] data-[state=closed]:animate-[verby-overlay-out_180ms_ease-in]" />

        <Dialog.Content className="fixed right-0 top-0 z-[var(--z-dialog)] flex h-dvh w-full max-w-md flex-col border-l border-primary-darkest bg-primary p-4 text-primary-text shadow-lg data-[state=open]:animate-[verby-sheet-in-right_280ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-[verby-sheet-out-right_220ms_ease-in]">
          <div className="flex items-center gap-3">
            {headerAction ? (
              <Button
                aria-label={headerAction.ariaLabel}
                title={headerAction.title}
                onClick={headerAction.onAction}
                icon={headerAction.icon}
                fullWidth={false}
                rounded
              />
            ) : (
              <Dialog.Close asChild>
                <Button
                  aria-label={ui.aria.closeSheet}
                  title={ui.common.close}
                  icon={<Cross1Icon className="size-4" />}
                  fullWidth={false}
                  rounded
                />
              </Dialog.Close>
            )}
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          </div>

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto">{children}</div>

          {footer ? <div className="mt-4">{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
