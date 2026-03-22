export type LibrarySettingsView =
  | 'library-create-new'
  | 'library-replace-other'
  | 'library-add-to-other'
  | 'library-remove-from'

export const LIBRARY_MENU_ITEMS: readonly { view: LibrarySettingsView; label: string }[] = [
  { view: 'library-create-new', label: 'Create new library lesson' },
  { view: 'library-replace-other', label: 'Replace library lesson' },
  { view: 'library-add-to-other', label: 'Add to library lesson' },
  { view: 'library-remove-from', label: 'Remove from library lesson' },
] as const

export const LIBRARY_VIEW_TITLES: Record<LibrarySettingsView, string> = {
  'library-create-new': 'Create new save',
  'library-replace-other': 'Replace other save',
  'library-add-to-other': 'Add to other save',
  'library-remove-from': 'Remove from save',
}
