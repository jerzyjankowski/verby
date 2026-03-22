import type {Language} from "../types/config.ts";

export const SETTINGS_STORAGE_KEY = 'settings'
export const CURRENT_LESSON_STORAGE_KEY = 'current-lesson'
const MARKED_VERBS_STORAGE_KEY_SUFFIX = '-marked-verbs'
const LIBRARY_STORAGE_KEY_SUFFIX = '-library'

export function getMarkedVerbsStorageKey(language: Language): string {
  return `${language}${MARKED_VERBS_STORAGE_KEY_SUFFIX}`
}

export function getLibraryStorageKey(language: Language): string {
  return `${language}${LIBRARY_STORAGE_KEY_SUFFIX}`
}