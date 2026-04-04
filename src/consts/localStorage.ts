import type {Language} from "../types/config.ts";

const PROJECT_STORAGE_KEY_PREFIX = 'verby_'

export const VERSION_STORAGE_KEY = `${PROJECT_STORAGE_KEY_PREFIX}version`
export const SETTINGS_STORAGE_KEY = `${PROJECT_STORAGE_KEY_PREFIX}settings`
export const CURRENT_LESSON_STORAGE_KEY = `${PROJECT_STORAGE_KEY_PREFIX}current_lesson`


const MARKED_VERBS_STORAGE_KEY_SUFFIX = '_marked_verbs'
const LIBRARY_STORAGE_KEY_SUFFIX = '_library'

export function getMarkedVerbsStorageKey(language: Language): string {
  return `${PROJECT_STORAGE_KEY_PREFIX}${language}${MARKED_VERBS_STORAGE_KEY_SUFFIX}`
}

export function getLibraryStorageKey(language: Language): string {
  return `${PROJECT_STORAGE_KEY_PREFIX}${language}${LIBRARY_STORAGE_KEY_SUFFIX}`
}