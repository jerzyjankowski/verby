import { getLanguageConfig } from '../configs/languageConfigMap.ts'
import type { Language } from '../types/config.ts'
import type { Verb } from '../types/verb.ts'

/** Raw verb from JSON; may use "translation" instead of "meaning" for backward compatibility */
type RawVerb = Omit<Verb, 'meaning'> & { meaning?: string; translation?: string }

/**
 * Loads a JSON file from the given path (relative to public, e.g. "data/esp/verbs-demo.json"),
 * parses it and returns an array of Verb. Normalizes "translation" to "meaning" if present.
 */
export async function loadVerbsFromJson(path: string): Promise<Verb[]> {
  const url = path.startsWith('/') ? path : `/${path}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load verbs: ${res.status} ${res.statusText} (${path})`)
  }
  const raw = (await res.json()) as RawVerb[]
  if (!Array.isArray(raw)) {
    throw new Error(`Verbs JSON must be an array (path: ${path})`)
  }
  return raw.map(normalizeVerb)
}

/** Loads verbs JSON for the language, or an empty list when no file is configured. */
export async function loadVerbsForLanguage(language: Language): Promise<Verb[]> {
  const cfg = getLanguageConfig(language)
  if (!cfg.verbsFilePath) return []
  return loadVerbsFromJson(cfg.verbsFilePath)
}

function normalizeVerb(row: RawVerb): Verb {
  return {
    id: row.id,
    level: row.level,
    verb: row.verb,
    meaning: row.meaning ?? row.translation ?? '',
    root: row.root,
    conjugation: row.conjugation,
    irregularForms: row.irregularForms,
    irregularConjugations: row.irregularConjugations,
  }
}
