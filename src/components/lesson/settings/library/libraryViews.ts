export type LibrarySettingsView =
  | 'library-create-new'
  | 'library-edit-current'
  | 'library-add-to-other'
  | 'library-replace-other'
  | 'library-remove-from'

export const LIBRARY_MENU_ITEMS: readonly { view: LibrarySettingsView; label: string }[] = [
  { view: 'library-create-new', label: 'Create new save' },
  { view: 'library-edit-current', label: 'Edit current save' },
  { view: 'library-add-to-other', label: 'Add to other save' },
  { view: 'library-replace-other', label: 'Replace other save' },
  { view: 'library-remove-from', label: 'Remove from save' },
] as const

export const LIBRARY_VIEW_TITLES: Record<LibrarySettingsView, string> = {
  'library-create-new': 'Create new save',
  'library-edit-current': 'Edit current save',
  'library-add-to-other': 'Add to other save',
  'library-replace-other': 'Replace other save',
  'library-remove-from': 'Remove from save',
}
