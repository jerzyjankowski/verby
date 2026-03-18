import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useState, type ReactElement } from 'react'

import type { DropdownItem } from './types'

export type DropdownProps = {
  trigger: ReactElement
  items: DropdownItem[]
  align?: 'start' | 'center' | 'end'
}

export default function Dropdown({ trigger, items, align = 'start' }: DropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Content
        align={align}
        className="z-50 w-[92vw] max-w-[18rem] rounded-xl border border-primary-darkest bg-primary p-1 text-primary-text shadow-lg"
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
    </DropdownMenu.Root>
  )
}

