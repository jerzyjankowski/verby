import Button from '../../shared/Button.tsx'
import { LIBRARY_MENU_ITEMS } from '../../../locales/index.ts'
import type { LibrarySettingsView } from '../../../types/library.ts'

type LibraryManagementProps = {
  onOpenLibraryView: (view: LibrarySettingsView) => void
}

export default function LibraryManagement({ onOpenLibraryView }: LibraryManagementProps) {
  return (
    <div className="flex flex-col gap-2">
      {LIBRARY_MENU_ITEMS.map(({ view, label }) => (
        <Button key={view} label={label} onClick={() => onOpenLibraryView(view)} />
      ))}
    </div>
  )
}
