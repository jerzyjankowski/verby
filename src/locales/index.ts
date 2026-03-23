import * as enLocale from './en.ts'
import * as plLocale from './pl.ts'
import { readStoredApplicationLanguage } from '../utils/settings.ts'

const activeLocale = readStoredApplicationLanguage() === 'PL' ? plLocale : enLocale

export const BATCH_LABELS = activeLocale.BATCH_LABELS
export const DIRECTION_LABELS = activeLocale.DIRECTION_LABELS
export const EXTRA_LABELS = activeLocale.EXTRA_LABELS
export const LANGUAGE_LABELS = activeLocale.LANGUAGE_LABELS
export const LEVEL_LABELS = activeLocale.LEVEL_LABELS
export const LIBRARY_MENU_ITEMS = activeLocale.LIBRARY_MENU_ITEMS
export const LIBRARY_VERB_SCOPE_LABELS = activeLocale.LIBRARY_VERB_SCOPE_LABELS
export const LIBRARY_VIEW_TITLES = activeLocale.LIBRARY_VIEW_TITLES
export const MOTIVATIONAL_QUOTES = activeLocale.MOTIVATIONAL_QUOTES
export const REGULARITY_LABELS = activeLocale.REGULARITY_LABELS
export const SPEED_LABELS = activeLocale.SPEED_LABELS
export const ui = activeLocale.ui

export * as pl from './pl.ts'
