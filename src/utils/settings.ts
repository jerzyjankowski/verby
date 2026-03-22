import { SETTINGS_STORAGE_KEY } from '../consts/localStorage.ts'
import {
  DEFAULT_APPLICATION_LANGUAGE,
  type ApplicationLanguage,
} from '../consts/settings.ts'
import type { Settings } from '../types/settings.ts'

function isApplicationLanguage(value: unknown): value is ApplicationLanguage {
  return value === 'EN' || value === 'PL'
}

/** Read persisted app settings from `localStorage` (safe defaults if missing or invalid). */
export function readStoredSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) {
      return { applicationLanguage: DEFAULT_APPLICATION_LANGUAGE }
    }
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object' && 'applicationLanguage' in parsed) {
      const lang = (parsed as { applicationLanguage: unknown }).applicationLanguage
      if (isApplicationLanguage(lang)) {
        return { applicationLanguage: lang }
      }
    }
  } catch {
    // ignore corrupt storage
  }
  return { applicationLanguage: DEFAULT_APPLICATION_LANGUAGE }
}

/** Stored UI locale (`EN` | `PL`). Resolved when `locales/index.ts` loads. */
export function readStoredApplicationLanguage(): ApplicationLanguage {
  return readStoredSettings().applicationLanguage
}

export function writeStoredSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}
