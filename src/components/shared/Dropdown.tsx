import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ReactElement } from 'react'

import type { DropdownItem } from './types'

export type DropdownProps = {
  trigger: ReactElement
  items: DropdownItem[]
  align?: 'start' | 'center' | 'end'
}

export default function Dropdown({ trigger, items, align = 'start' }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Content
        align={align}
        className="z-50 w-[92vw] max-w-[18rem] rounded-xl border border-verby-secondary bg-verby-bg p-1 text-verby-text shadow-lg"
      >
        {items.map((item) => (
          <DropdownMenu.Item
            key={item.key}
            disabled={item.disabled}
            onSelect={(event) => {
              event.preventDefault()
              if (!item.disabled) item.onSelect()
            }}
            className={[
              'cursor-pointer select-none rounded-lg px-3 py-2 text-sm outline-none',
              'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
              'hover:bg-verby-secondary/30 focus:bg-verby-secondary/30',
            ].join(' ')}
          >
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

