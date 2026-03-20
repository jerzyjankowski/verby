import type { Verb } from '../types/verb'

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
