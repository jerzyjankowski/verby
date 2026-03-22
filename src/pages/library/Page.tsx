import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import * as Switch from '@radix-ui/react-switch'
import { useNavigate } from 'react-router-dom'

import Confirmation from '../../components/lesson/settings/Confirmation.tsx'
import Button from '../../components/shared/Button.tsx'
import Dropdown from '../../components/shared/Dropdown.tsx'
import Sheet from '../../components/shared/Sheet.tsx'
import TextArea from '../../components/shared/TextArea.tsx'
import TextField from '../../components/shared/TextField.tsx'
import type { DropdownItem } from '../../components/shared/types.ts'
import { useToast } from '../../components/shared/Toast.tsx'
import {
  LIBRARY_SAVE_NAME_MAX_LEN,
  LIBRARY_SAVE_NOTES_MAX_LEN,
} from '../../consts/librarySave.ts'
import { MAIN_PAGE_URL } from '../../consts/urls.ts'
import { LANGUAGE_LABELS, ui } from '../../locales'
import { type Language, LANGUAGE_OPTIONS } from '../../types/config.ts'
import type { Verb } from '../../types/verb.ts'
import { loadVerbsForLanguage } from '../../utils/jsonVerbsLoader.ts'
import { loadCurrentLessonFromLocalStorage } from '../../utils/localStorage.ts'
import {
  deleteLibraryEntry,
  getLibraryLessonByName,
  getLibraryLessonNames,
  updateLibraryEntryMetadata,
} from '../../utils/library.ts'

function defaultLanguageFromNewLesson(): Language | undefined {
  const lesson = loadCurrentLessonFromLocalStorage()
  const lang = lesson?.config?.language
  if (lang !== undefined && LANGUAGE_OPTIONS.includes(lang)) {
    return lang
  }
  return undefined
}

type DetailView = 'edit' | 'confirmDelete'

export default function Page() {
  const navigate = useNavigate()
  const toast = useToast()
  const [language, setLanguage] = useState<Language | undefined>(defaultLanguageFromNewLesson)
  const [listVersion, setListVersion] = useState(0)

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailView, setDetailView] = useState<DetailView>('edit')
  const [selectedName, setSelectedName] = useState<string | null>(null)

  const [draftName, setDraftName] = useState('')
  const [draftDesc, setDraftDesc] = useState('')
  const [baselineName, setBaselineName] = useState('')
  const [baselineDesc, setBaselineDesc] = useState('')

  const [displayVerbs, setDisplayVerbs] = useState(false)
  const [verbsById, setVerbsById] = useState<Map<number, Verb>>(new Map())
  const [verbsLoading, setVerbsLoading] = useState(false)
  const [verbsError, setVerbsError] = useState<string | null>(null)

  const languageItems: DropdownItem[] = LANGUAGE_OPTIONS.map((code) => ({
    key: code,
    label: LANGUAGE_LABELS[code],
    onSelect: () => setLanguage(code),
  }))

  const entryNames = useMemo(() => {
    if (language === undefined) return []
    return getLibraryLessonNames(language)
  }, [language, listVersion])

  const detailLesson = useMemo(() => {
    if (language === undefined || !selectedName) return null
    return getLibraryLessonByName(language, selectedName)
  }, [language, selectedName, listVersion])

  const verbCount = detailLesson?.verbs.length ?? 0

  useEffect(() => {
    setDisplayVerbs(false)
  }, [selectedName])

  useEffect(() => {
    if (!detailOpen || detailView !== 'edit' || language === undefined || !displayVerbs) {
      return
    }

    let cancelled = false
    setVerbsLoading(true)
    setVerbsError(null)
    loadVerbsForLanguage(language)
      .then((verbs) => {
        if (!cancelled) {
          setVerbsById(new Map(verbs.map((v) => [v.id, v])))
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setVerbsById(new Map())
          setVerbsError(e instanceof Error ? e.message : ui.libraryPage.loadVerbsFailed)
        }
      })
      .finally(() => {
        if (!cancelled) setVerbsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [detailOpen, detailView, language, displayVerbs])

  useEffect(() => {
    if (!detailOpen || language === undefined || !selectedName) return
    const entry = getLibraryLessonByName(language, selectedName)
    if (!entry) {
      setDetailOpen(false)
      setSelectedName(null)
      return
    }
    setDetailView('edit')
    const n = entry.name?.trim() ?? ''
    const d = (entry.description ?? '').trim()
    setDraftName(entry.name ?? '')
    setDraftDesc(entry.description ?? '')
    setBaselineName(n)
    setBaselineDesc(d)
  }, [detailOpen, language, selectedName])

  const trimmedDraftName = draftName.trim()
  const trimmedDraftDesc = draftDesc.trim()

  const nameDuplicate = useMemo(() => {
    if (!language || trimmedDraftName.length === 0) return false
    const key = trimmedDraftName.toLowerCase()
    const baselineKey = baselineName.toLowerCase()
    return entryNames.some((n) => n.toLowerCase() !== baselineKey && n.toLowerCase() === key)
  }, [language, trimmedDraftName, baselineName, entryNames])

  const dirty =
    language !== undefined &&
    selectedName !== null &&
    (trimmedDraftName !== baselineName || trimmedDraftDesc !== baselineDesc)

  const canSave =
    dirty &&
    trimmedDraftName.length > 0 &&
    !nameDuplicate &&
    draftName.length <= LIBRARY_SAVE_NAME_MAX_LEN &&
    draftDesc.length <= LIBRARY_SAVE_NOTES_MAX_LEN

  const nameAtLimit = draftName.length >= LIBRARY_SAVE_NAME_MAX_LEN
  const notesAtLimit = draftDesc.length >= LIBRARY_SAVE_NOTES_MAX_LEN

  const openEntry = (name: string) => {
    setSelectedName(name)
    setDetailOpen(true)
  }

  const handleDetailOpenChange = (open: boolean) => {
    setDetailOpen(open)
    if (!open) {
      setSelectedName(null)
      setDetailView('edit')
      setDisplayVerbs(false)
      setVerbsById(new Map())
      setVerbsError(null)
    }
  }

  const handleSave = () => {
    if (!language || !selectedName || !canSave) return
    const result = updateLibraryEntryMetadata(
      language,
      selectedName,
      draftName,
      draftDesc,
    )
    if (!result.ok) {
      if (result.reason === 'duplicate_name') {
        toast.error(ui.toast.libraryTitle, ui.toast.duplicateSaveName)
      } else if (result.reason === 'not_found') {
        toast.error(ui.toast.libraryTitle, ui.toast.saveRemovedElsewhere)
      } else {
        toast.error(ui.toast.libraryTitle, ui.toast.enterSaveName)
      }
      return
    }
    const nextName = result.entry.name?.trim() ?? ''
    const nextDesc = (result.entry.description ?? '').trim()
    setBaselineName(nextName)
    setBaselineDesc(nextDesc)
    setDraftName(result.entry.name ?? '')
    setDraftDesc(result.entry.description ?? '')
    setSelectedName(nextName)
    setListVersion((v) => v + 1)
    toast.success(ui.toast.libraryTitle, ui.toast.saveUpdated)
  }

  const handleConfirmDelete = () => {
    if (!language || !selectedName) return
    const ok = deleteLibraryEntry(language, selectedName)
    if (!ok) {
      toast.error(ui.toast.libraryTitle, ui.toast.deleteSaveFailed)
      return
    }
    setDetailOpen(false)
    setSelectedName(null)
    setDetailView('edit')
    setListVersion((v) => v + 1)
    toast.success(ui.toast.libraryTitle, ui.toast.saveDeleted)
  }

  const nameDescribedBy = [
    nameDuplicate ? 'library-edit-name-dup' : null,
    nameAtLimit ? 'library-edit-name-limit' : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="min-h-screen bg-primary text-primary-text">
      <header className="border-b border-primary-darkest bg-primary-darkest">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Button
            onClick={() => navigate(MAIN_PAGE_URL)}
            label={ui.common.back}
            icon={<ArrowLeftIcon className="size-4" />}
            fullWidth={false}
          />
          <div className="min-w-0 flex-1">
            <Dropdown
              selectedLabel={language !== undefined ? LANGUAGE_LABELS[language] : undefined}
              placeholder={ui.prepare.selectLanguagePlaceholder}
              triggerVariant="onDark"
              items={languageItems}
              align="start"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-4">
        <div className="verby-card bg-primary-darkest flex flex-col gap-4 p-4">
          {language === undefined ? (
            <p className="text-sm text-primary-text/80">{ui.libraryPage.noLanguageYet}</p>
          ) : entryNames.length === 0 ? (
            <p className="text-sm text-primary-text/80">{ui.libraryPage.noSavesForLanguage}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {entryNames.map((name) => (
                <li key={name}>
                  <Button
                    label={name}
                    onClick={() => openEntry(name)}
                    className="text-left text-sm font-medium"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Sheet
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        title={
          detailView === 'confirmDelete'
            ? ui.libraryPage.sheetTitleDelete
            : ui.libraryPage.sheetTitleEdit
        }
        footer={
          detailView === 'edit' ? (
            <div className="flex flex-col gap-2">
              <Button label={ui.common.save} main onClick={handleSave} disabled={!canSave} />
              <Button
                label={ui.common.delete}
                onClick={() => setDetailView('confirmDelete')}
                disabled={!language || !selectedName}
              />
            </div>
          ) : null
        }
      >
        {detailView === 'confirmDelete' ? (
          <Confirmation
            message={
              <p>
                {ui.libraryPage.deleteConfirmBeforeName}{' '}
                <strong>{selectedName ?? ''}</strong> {ui.libraryPage.deleteConfirmAfterName}
              </p>
            }
            onConfirm={handleConfirmDelete}
            onCancel={() => setDetailView('edit')}
            confirmLabel={ui.common.delete}
            cancelLabel={ui.common.cancel}
          />
        ) : (
          <div className="flex flex-col gap-4 text-sm text-primary-text">
            <label className="flex flex-col gap-1.5 font-medium">
              <span>{ui.libraryPage.nameLabel}</span>
              <TextField
                type="text"
                value={draftName}
                maxLength={LIBRARY_SAVE_NAME_MAX_LEN}
                onChange={(e) => setDraftName(e.target.value)}
                autoComplete="off"
                aria-invalid={nameDuplicate}
                aria-describedby={nameDescribedBy || undefined}
              />
              {nameDuplicate ? (
                <span id="library-edit-name-dup" className="font-normal text-text-error">
                  {ui.libraryPage.nameDuplicateInline}
                </span>
              ) : null}
              {nameAtLimit ? (
                <span id="library-edit-name-limit" className="font-normal text-primary-text/70">
                  {ui.libraryPage.maxChars(LIBRARY_SAVE_NAME_MAX_LEN)}
                </span>
              ) : null}
            </label>
            <label className="flex flex-col gap-1.5 font-medium">
              <span>{ui.libraryPage.descriptionLabel}</span>
              <TextArea
                value={draftDesc}
                maxLength={LIBRARY_SAVE_NOTES_MAX_LEN}
                onChange={(e) => setDraftDesc(e.target.value)}
                rows={4}
                placeholder={ui.libraryPage.optionalNotesPlaceholder}
              />
              {notesAtLimit ? (
                <span className="font-normal text-primary-text/70">
                  {ui.libraryPage.maxChars(LIBRARY_SAVE_NOTES_MAX_LEN)}
                </span>
              ) : null}
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
              <span>{ui.libraryPage.displayVerbs(verbCount)}</span>
              <Switch.Root
                checked={displayVerbs}
                onCheckedChange={setDisplayVerbs}
                className="relative h-6 w-11 shrink-0 rounded-full bg-primary-darkest transition-colors data-[state=checked]:bg-primary-text"
              >
                <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </label>

            {displayVerbs ? (
              <div className="flex flex-col gap-2">
                {verbsLoading ? (
                  <p className="text-sm text-primary-text/80">{ui.libraryPage.loadingVerbs}</p>
                ) : verbsError ? (
                  <p className="text-sm text-text-error">{verbsError}</p>
                ) : verbCount === 0 ? (
                  <p className="text-sm text-primary-text/80">{ui.libraryPage.noVerbsInSave}</p>
                ) : (
                  <div className="max-h-[min(50vh,24rem)] overflow-auto rounded-lg border border-primary-darkest">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="sticky top-0 bg-primary-darker">
                        <tr className="border-b border-primary-darkest">
                          <th
                            scope="col"
                            className="w-14 min-w-[3.25rem] whitespace-nowrap px-2 py-2 font-semibold tabular-nums"
                          >
                            {ui.libraryPage.tableId}
                          </th>
                          <th
                            scope="col"
                            className="w-16 min-w-[3.5rem] max-w-[4.5rem] whitespace-nowrap px-2 py-2 font-semibold"
                          >
                            {ui.libraryPage.tableLevel}
                          </th>
                          <th scope="col" className="min-w-0 px-2 py-2 font-semibold">
                            {ui.libraryPage.tableVerb}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...(detailLesson?.verbs ?? [])]
                          .sort((a, b) => a - b)
                          .map((id) => {
                          const v = verbsById.get(id)
                          return (
                            <tr
                              key={id}
                              className="border-b border-primary-darkest/80 last:border-b-0"
                            >
                              <td className="w-14 min-w-[3.25rem] whitespace-nowrap px-2 py-1.5 tabular-nums text-primary-text/90">
                                {id}
                              </td>
                              <td className="w-16 min-w-[3.5rem] max-w-[4.5rem] whitespace-nowrap px-2 py-1.5 text-primary-text/90">
                                {v?.level ?? ui.common.emDash}
                              </td>
                              <td className="min-w-0 break-words px-2 py-1.5">
                                {v?.verb ?? ui.common.emDash}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </Sheet>
    </div>
  )
}
