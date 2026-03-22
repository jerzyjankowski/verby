import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import * as Switch from '@radix-ui/react-switch'

import Button from '../../components/shared/Button.tsx'
import Dropdown from '../../components/shared/Dropdown.tsx'
import type { DropdownItem } from '../../components/shared/types.ts'
import { getLanguageConfig } from '../../configs/languageConfigMap.ts'
import {
  type Language,
  LANGUAGE_LABELS,
  LANGUAGE_OPTIONS,
} from '../../types/config.ts'
import type { MarkedVerb, Verb } from '../../types/verb.ts'
import {
  loadCurrentLessonFromLocalStorage,
  loadMarkedVerbsFromLocalStorage,
  saveMarkedVerbsToLocalStorage,
} from '../../utils/localStorage.ts'
import { loadVerbsFromJson } from '../../utils/jsonVerbsLoader.ts'
import {MAIN_PAGE_URL} from "../../consts/urls.ts";

type Row = {
  id: number
  description: string
  active: boolean
}

function normalizeMarked(list: MarkedVerb[]): MarkedVerb[] {
  return [...list]
    .map((m) => ({ id: m.id, description: m.description.trim() }))
    .sort((a, b) => a.id - b.id)
}

function markedListsEqual(a: MarkedVerb[], b: MarkedVerb[]): boolean {
  const na = normalizeMarked(a)
  const nb = normalizeMarked(b)
  if (na.length !== nb.length) return false
  return na.every((m, i) => m.id === nb[i].id && m.description === nb[i].description)
}

function defaultLanguageFromNewLesson(): Language | undefined {
  const lesson = loadCurrentLessonFromLocalStorage()
  const lang = lesson?.config?.language
  if (lang !== undefined && LANGUAGE_OPTIONS.includes(lang)) {
    return lang
  }
  return undefined
}

export default function Page() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<Language | undefined>(defaultLanguageFromNewLesson)
  const [baseline, setBaseline] = useState<MarkedVerb[]>([])
  const [rows, setRows] = useState<Row[]>([])
  const [verbsById, setVerbsById] = useState<Map<number, Verb>>(new Map())
  const [verbsLoading, setVerbsLoading] = useState(false)
  const [verbsError, setVerbsError] = useState<string | null>(null)

  const languageItems: DropdownItem[] = LANGUAGE_OPTIONS.map((code) => ({
    key: code,
    label: LANGUAGE_LABELS[code],
    onSelect: () => setLanguage(code),
  }))

  useEffect(() => {
    if (!language) {
      setBaseline([])
      setRows([])
      setVerbsById(new Map())
      setVerbsError(null)
      setVerbsLoading(false)
      return
    }

    const marked = loadMarkedVerbsFromLocalStorage(language)
    setBaseline(marked)
    setRows(marked.map((m) => ({ id: m.id, description: m.description, active: true })))

    const path = getLanguageConfig(language).verbsFilePath
    if (!path) {
      setVerbsById(new Map())
      setVerbsError('No verb list for this language.')
      setVerbsLoading(false)
      return
    }

    setVerbsLoading(true)
    setVerbsError(null)
    loadVerbsFromJson(path)
      .then((verbs) => {
        setVerbsById(new Map(verbs.map((v) => [v.id, v])))
      })
      .catch((e: unknown) => {
        setVerbsById(new Map())
        setVerbsError(e instanceof Error ? e.message : 'Failed to load verbs.')
      })
      .finally(() => setVerbsLoading(false))
  }, [language])

  const draftMarked: MarkedVerb[] = useMemo(
    () =>
      rows
        .filter((r) => r.active)
        .map((r) => ({ id: r.id, description: r.description })),
    [rows],
  )

  const dirty = language !== undefined && !markedListsEqual(draftMarked, baseline)

  const saveBlocked = draftMarked.some((m) => m.description.trim().length === 0)

  const handleSave = () => {
    if (!language || saveBlocked) return
    const next: MarkedVerb[] = draftMarked.map((m) => ({
      id: m.id,
      description: m.description.trim(),
    }))
    saveMarkedVerbsToLocalStorage(language, next)
    setBaseline(next)
    setRows(next.map((m) => ({ ...m, active: true })))
  }

  const verbLabel = (id: number) => verbsById.get(id)?.verb ?? `Verb #${id}`

  return (
    <div
      className={[
        'min-h-screen bg-primary text-primary-text',
        dirty ? 'pb-28' : '',
      ].join(' ')}
    >
      <header className="border-b border-primary-darker bg-primary-darkest">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Button
            onClick={() => navigate(MAIN_PAGE_URL)}
            label="Back"
            icon={<ArrowLeftIcon className="size-4" />}
            fullWidth={false}
          />
          <div className="min-w-0 flex-1">
            <Dropdown
              selectedLabel={language !== undefined ? LANGUAGE_LABELS[language] : undefined}
              placeholder="Select Language..."
              triggerVariant="onDark"
              items={languageItems}
              align="start"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-4">
        <div className="verby-card bg-primary-darkest p-4 flex flex-col gap-4">
          {language === undefined ? (
            <p className="text-sm text-primary-text/80">No language selected yet.</p>
          ) : verbsLoading ? (
            <p className="text-sm text-primary-text/80">Loading verbs…</p>
          ) : verbsError ? (
            <p className="text-sm text-text-error">{verbsError}</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-primary-text/80">No marked verbs for this language.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-3 overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker p-4"
                >
                  <p className="text-lg font-semibold">{verbLabel(row.id)}</p>
                  <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
                    <span>Marked</span>
                    <Switch.Root
                      checked={row.active}
                      onCheckedChange={(checked) =>
                        setRows((prev) =>
                          prev.map((r) => (r.id === row.id ? { ...r, active: checked } : r)),
                        )
                      }
                      className="relative h-6 w-11 shrink-0 rounded-full bg-primary-darkest transition-colors data-[state=checked]:bg-primary-text"
                    >
                      <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-[22px]" />
                    </Switch.Root>
                  </label>
                  {row.active ? (
                    <label className="flex flex-col gap-1.5 text-sm font-medium">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id ? { ...r, description: e.target.value } : r,
                            ),
                          )
                        }
                        className="rounded-lg border border-primary-darkest bg-primary px-3 py-2 text-primary-text placeholder:text-primary-text/50"
                        placeholder="Reason for marking..."
                      />
                    </label>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {dirty ? (
        <div className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] border-t border-primary-darkest bg-primary-darkest p-4">
          <div className="mx-auto max-w-2xl">
            <Button
              label="Save"
              main
              onClick={handleSave}
              disabled={saveBlocked}
              title={
                saveBlocked ? 'Each marked verb needs a non-empty description.' : undefined
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
