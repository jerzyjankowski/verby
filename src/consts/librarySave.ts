export const LIBRARY_SAVE_NAME_MAX_LEN = 32
export const LIBRARY_SAVE_NOTES_MAX_LEN = 256

export const LIBRARY_VERB_SCOPE_OPTIONS = ['all', 'not_learnt', 'learnt', 'current_verb'] as const
export type LibraryVerbScope = (typeof LIBRARY_VERB_SCOPE_OPTIONS)[number]

export const LIBRARY_VERB_SCOPE_LABELS: Record<LibraryVerbScope, string> = {
  all: 'All',
  not_learnt: 'Not learnt',
  learnt: 'Learnt',
  current_verb: 'Current verb',
}
