import { LIBRARY_SAVE_NAME_MAX_LEN } from '../consts/librarySave.ts'
import type { LibraryVerbScope } from '../consts/librarySave.ts'
import { getLanguageConfig } from '../configs/languageConfigMap.ts'
import type { Direction, Extra, Language, LessonSave, Level } from '../types/config.ts'
import { LEVEL_OPTIONS } from '../types/config.ts'
import { buildLessonSaveForLibrary } from './library.ts'

function levelToken(level: Level): string {
  return level === 'MAIN' ? 'Main' : level
}

/**
 * Contiguous selections use a hyphen range (e.g. A1-B2). Non-contiguous use concatenation (e.g. A0C1).
 */
export function formatLevelsForLibrarySaveName(levels: Level[]): string {
  const seen = new Set<Level>()
  const ordered: Level[] = []
  for (const lev of levels) {
    if (!LEVEL_OPTIONS.includes(lev) || seen.has(lev)) continue
    seen.add(lev)
    ordered.push(lev)
  }
  if (ordered.length === 0) return 'Main'

  const indices = ordered.map((l) => LEVEL_OPTIONS.indexOf(l)).sort((a, b) => a - b)
  const codes = indices.map((i) => levelToken(LEVEL_OPTIONS[i]!))
  if (codes.length === 1) return codes[0]!

  const contiguous = indices[indices.length - 1]! - indices[0]! === indices.length - 1
  if (contiguous) return `${codes[0]}-${codes[codes.length - 1]!}`
  return codes.join('')
}

export function directionToSaveNameToken(direction: Direction): 'fromPL' | 'toPL' {
  return direction === 'to_foreign' ? 'fromPL' : 'toPL'
}

function formatExtraForSaveName(
  extra: Extra,
  conjugationIndex: number | undefined,
  conjugationLabels: readonly string[],
): string {
  if (extra === 'forms') return 'forms'
  if (extra === 'no') return ''
  if (extra === 'conjugation') {
    if (conjugationIndex == null) return 'conjugation'
    const label = conjugationLabels[conjugationIndex]?.replace(/\s+/g, ' ').trim()
    return label && label.length > 0 ? label : 'conjugation'
  }
  return ''
}

function formatDateTimeForSaveName(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatShortDateForSaveName(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${String(d.getFullYear()).slice(2)}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

function assembleName(count: number, levels: string, dir: string, extra: string, datePart: string): string {
  return [`[${count}]`, levels, dir, extra, datePart].filter((p) => p.length > 0).join(' ')
}

function abbrevLevels(levels: string): string {
  return levels.replace(/Main/g, 'M')
}

/** Keeps as much of `extra` as fits between fixed head (`[n] levels dir`) and `datePart`. */
function assembleWithExtraTruncated(
  count: number,
  levels: string,
  dir: string,
  extra: string,
  datePart: string,
  maxLen: number,
): string {
  if (!extra) return assembleName(count, levels, dir, '', datePart)
  const head = `[${count}] ${levels} ${dir}`
  const room = maxLen - head.length - datePart.length - 2
  if (room < 1) return assembleName(count, levels, dir, '', datePart)
  const clipped = extra.length <= room ? extra : extra.slice(0, room).trimEnd()
  return assembleName(count, levels, dir, clipped, datePart)
}

/**
 * Builds a default library save name from the verbs that would be stored for `scope`,
 * lesson levels, Polish direction, extra mode (forms / conjugation label / none), and timestamp.
 * Result is capped at `maxLen` (default library max) using progressively shorter fragments.
 */
export function buildSuggestedLibrarySaveName(params: {
  lesson: LessonSave
  scope: LibraryVerbScope
  language: Language
  currentVerbId?: number
  now?: Date
  maxLen?: number
}): string {
  const {
    lesson,
    scope,
    language,
    currentVerbId,
    now = new Date(),
    maxLen = LIBRARY_SAVE_NAME_MAX_LEN,
  } = params

  const snapshot = buildLessonSaveForLibrary(lesson, scope, currentVerbId)
  if (!snapshot) return ''

  const count = snapshot.verbs.length
  const levels = formatLevelsForLibrarySaveName(lesson.config.levels)
  const dir = directionToSaveNameToken(lesson.config.direction)
  const cfg = getLanguageConfig(language)
  const extra = formatExtraForSaveName(
    lesson.config.extra,
    lesson.config.conjugation,
    cfg.languageLabels.conjugationsLabels,
  )

  const candidates: Array<{ extra: string; datePart: string; levels: string }> = []
  candidates.push({ extra, datePart: formatDateTimeForSaveName(now), levels })
  candidates.push({ extra, datePart: formatShortDateForSaveName(now), levels })
  if (extra.includes(' ')) {
    const first = extra.split(/\s+/)[0]!
    if (first !== extra) {
      candidates.push({ extra: first, datePart: formatDateTimeForSaveName(now), levels })
      candidates.push({ extra: first, datePart: formatShortDateForSaveName(now), levels })
    }
  }
  candidates.push({ extra: '', datePart: formatShortDateForSaveName(now), levels })
  candidates.push({ extra: '', datePart: formatShortDateForSaveName(now), levels: abbrevLevels(levels) })

  for (const c of candidates) {
    const s = assembleName(count, c.levels, dir, c.extra, c.datePart)
    if (s.length <= maxLen) return s
    if (c.extra) {
      const t = assembleWithExtraTruncated(count, c.levels, dir, c.extra, c.datePart, maxLen)
      if (t.length <= maxLen) return t
    }
  }

  let fallback = assembleName(count, abbrevLevels(levels), dir, extra, formatShortDateForSaveName(now))
  if (fallback.length > maxLen) {
    fallback = assembleWithExtraTruncated(
      count,
      abbrevLevels(levels),
      dir,
      extra,
      formatShortDateForSaveName(now),
      maxLen,
    )
  }
  if (fallback.length <= maxLen) return fallback

  fallback = assembleName(count, abbrevLevels(levels), dir, '', formatShortDateForSaveName(now))
  if (fallback.length <= maxLen) return fallback

  fallback = `[${count}] ${dir} ${formatShortDateForSaveName(now)}`
  if (fallback.length <= maxLen) return fallback

  return fallback.slice(0, maxLen).trimEnd()
}
