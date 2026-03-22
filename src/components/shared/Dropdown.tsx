import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useState } from 'react'

import type { DropdownItem } from './types'

export type DropdownTriggerVariant = 'default' | 'onDark'

export type DropdownProps = {
  items: DropdownItem[]
  align?: 'start' | 'center' | 'end'
  /** Optional left label (e.g. grid cell before the field). */
  label?: string
  /**
   * Trigger text when a value is selected.
   * If empty/undefined, `placeholder` is shown (muted).
   */
  selectedLabel?: string
  /** Shown when `selectedLabel` is empty. */
  placeholder?: string
  /** Border contrast for the trigger button. */
  triggerVariant?: DropdownTriggerVariant
}

const triggerButtonClasses: Record<DropdownTriggerVariant, string> = {
  default: 'border-primary-darkest',
  onDark: 'border-primary-darker',
}

export default function Dropdown({
  items,
  align = 'start',
  label,
  selectedLabel,
  placeholder = 'Select…',
  triggerVariant = 'default',
}: DropdownProps) {
  const [open, setOpen] = useState(false)

  const menu = (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={[
            'w-full min-w-0 truncate rounded-lg border bg-primary px-3 py-2 text-left text-primary-text transition-colors',
            'cursor-pointer hover:bg-primary-darker focus:bg-primary-darker',
            triggerButtonClasses[triggerVariant],
          ].join(' ')}
        >
          {selectedLabel ? (
            selectedLabel
          ) : (
            <span className="text-primary-text/50">{placeholder}</span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={4}
          collisionPadding={8}
          className="z-[var(--z-dropdown)] max-h-[var(--radix-dropdown-menu-content-available-height)] w-[var(--radix-dropdown-menu-trigger-width)] max-w-[calc(100vw-1rem)] overflow-y-auto overscroll-contain rounded-xl border border-primary-darkest bg-primary p-1 text-primary-text shadow-lg"
        >
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.key}
              disabled={item.disabled}
              onSelect={() => {
                if (!item.disabled) {
                  item.onSelect()
                  setOpen(false)
                }
              }}
              className={[
                'cursor-pointer select-none rounded-lg px-3 py-2 text-sm outline-none',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                'hover:bg-primary-darker focus:bg-primary-darker cursor-pointer',
              ].join(' ')}
            >
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )

  if (label !== undefined && label !== '') {
    return (
      <>
        <span className="text-sm text-primary-text">{label}</span>
        <div className="min-w-0">{menu}</div>
      </>
    )
  }

  return menu
}
