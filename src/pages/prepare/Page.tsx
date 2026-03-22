import { type ReactNode, useState } from 'react'
import { ArrowLeftIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

import Button from '../../components/shared/Button.tsx'
import Dropdown from '../../components/shared/Dropdown.tsx'
import type { DropdownItem } from '../../components/shared/types.ts'
import Confirmation from '../../components/lesson/settings/Confirmation.tsx'
import Sheet from '../../components/shared/Sheet.tsx'
import { PREPARE_SOURCE_ALL_KEY, usePrepareLesson } from '../../hooks/usePrepareLesson.ts'
import { ui } from '../../locales/index.ts'
import type { LessonConfig, Level } from '../../types/config.ts'
import { MAIN_PAGE_URL } from '../../consts/urls.ts'

function StartLessonConfirmBody({
  lessonVerbCount,
  availableVerbCountBeforeBatch,
  batch,
}: {
  lessonVerbCount: number
  availableVerbCountBeforeBatch: number
  batch: LessonConfig['batch']
}): ReactNode {
  const shortfall =
    typeof batch === 'number' && availableVerbCountBeforeBatch < batch

  return (
    <>
      <p>
        {ui.prepare.startLessonIncludeLead}{' '}
        <strong>{lessonVerbCount}</strong> {ui.prepare.lessonIncludeNounPhrase(lessonVerbCount)}
      </p>
      <p>
        <strong>{availableVerbCountBeforeBatch}</strong>{' '}
        {ui.prepare.matchedFiltersAfterStrong(availableVerbCountBeforeBatch)}
      </p>
      {shortfall ? (
        <p>{ui.prepare.batchShortfall(batch, availableVerbCountBeforeBatch)}</p>
      ) : null}
    </>
  )
}

function NoVerbsFoundSheetBody(): ReactNode {
  return <p>{ui.prepare.noVerbsBody}</p>
}

function ConfigRow({
  label,
  value,
  options,
  labelMap,
  onSelect,
  placeholder = ui.prepare.selectPlaceholder,
}: {
  label: string
  value: string | number | undefined
  options: readonly (string | number)[]
  labelMap: Record<string, string>
  onSelect: (key: string) => void
  placeholder?: string
}) {
  const displayValue = value !== undefined ? labelMap[String(value)] : undefined
  const items: DropdownItem[] = options.map((opt) => ({
    key: String(opt),
    label: labelMap[String(opt)],
    onSelect: () => onSelect(String(opt)),
  }))

  return (
    <Dropdown
      label={label}
      selectedLabel={displayValue}
      placeholder={placeholder}
      items={items}
      align="start"
    />
  )
}

function SourceHelpPanel({
  allVerbs,
  description,
}: {
  allVerbs: boolean
  description: string | undefined
}) {
  if (allVerbs) {
    return (
      <p className="text-sm leading-relaxed text-primary-text/90">{ui.prepare.sourceHelpAll}</p>
    )
  }
  const desc = description?.trim() ?? ''
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-primary-text/90">
      {ui.prepare.sourceHelpSave(desc)}
    </p>
  )
}

function LevelConfigRow({
  label,
  selected,
  options,
  labelMap,
  onToggle,
}: {
  label: string
  selected: Level[] | undefined
  options: readonly Level[]
  labelMap: Record<string, string>
  onToggle: (key: string) => void
}) {
  return (
    <>
      <span className="flex h-10 shrink-0 items-center self-start text-sm text-primary-text">
        {label}
      </span>
      <div className="flex min-w-0 flex-wrap gap-2 self-start">
        {options.map((opt) => {
          const key = String(opt)
          const on = selected?.includes(opt) ?? false
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(key)}
              className={[
                'rounded-lg border px-3 py-2 text-sm transition-colors',
                on
                  ? 'border-primary-text/40 bg-primary-darker text-primary-text'
                  : 'border-primary-darkest bg-primary text-primary-text/70 hover:bg-primary-darker',
              ].join(' ')}
            >
              {labelMap[key]}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default function Page() {
  const navigate = useNavigate()
  const {
    form,
    hasExtraChoices,
    options,
    labels,
    setLanguage,
    setLibrarySource,
    toggleLevel,
    setDirection,
    setExtra,
    setConjugation,
    setRegularity,
    setSpeed,
    setBatch,
    isStarting,
    pendingStart,
    startConfirmOpen,
    handleStart,
    handleStartConfirmOpenChange,
    confirmStartLesson,
    cancelStartLesson,
    startDisabled,
  } = usePrepareLesson()

  const [sourceHelpOpen, setSourceHelpOpen] = useState(false)

  const sheetHasVerbs = pendingStart ? pendingStart.lesson.verbs.length > 0 : false

  const languageItems: DropdownItem[] = options.language.map((opt) => ({
    key: String(opt),
    label: labels.language[String(opt)],
    onSelect: () => setLanguage(String(opt)),
  }))

  const sourceItems: DropdownItem[] = options.source.map((opt) => ({
    key: String(opt),
    label: labels.source[String(opt)],
    onSelect: () => setLibrarySource(String(opt)),
  }))

  const sourceIsAllVerbs =
    form.libraryLessonSaveName == null || form.libraryLessonSaveName.trim() === ''

  return (
    <div className="min-h-screen bg-primary text-primary-text pb-28">
      {pendingStart ? (
        <Sheet
          open={startConfirmOpen}
          onOpenChange={handleStartConfirmOpenChange}
          title={sheetHasVerbs ? ui.prepare.sheetStartTitle : ui.prepare.sheetNoVerbsTitle}
        >
          <Confirmation
            message={
              sheetHasVerbs ? (
                <StartLessonConfirmBody
                  lessonVerbCount={pendingStart.lesson.verbs.length}
                  availableVerbCountBeforeBatch={pendingStart.availableVerbCountBeforeBatch}
                  batch={pendingStart.batch}
                />
              ) : (
                <NoVerbsFoundSheetBody />
              )
            }
            onConfirm={confirmStartLesson}
            onCancel={cancelStartLesson}
            confirmLabel={ui.prepare.startLesson}
            cancelLabel={ui.common.cancel}
            confirmDisabled={!sheetHasVerbs}
          />
        </Sheet>
      ) : null}

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
              selectedLabel={
                form.language !== undefined ? labels.language[String(form.language)] : undefined
              }
              placeholder={ui.prepare.selectLanguagePlaceholder}
              triggerVariant="onDark"
              items={languageItems}
              align="start"
            />
          </div>
        </div>
      </header>

      {form.language ? (
        <div className="mx-auto max-w-2xl p-4">
          <div className="verby-card grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4 p-4 bg-primary-darkest">
            <span className="flex h-10 shrink-0 items-center self-start text-sm text-primary-text">
              {ui.prepare.rowSource}
            </span>
            <div className="flex min-w-0 items-center gap-2 self-start">
              <div className="min-w-0 flex-1">
                <Dropdown
                  selectedLabel={
                    labels.source[
                      String(form.libraryLessonSaveName ?? PREPARE_SOURCE_ALL_KEY)
                    ]
                  }
                  placeholder={ui.prepare.selectPlaceholder}
                  items={sourceItems}
                  align="start"
                />
              </div>
              <button
                type="button"
                onClick={() => setSourceHelpOpen((open) => !open)}
                aria-expanded={sourceHelpOpen}
                aria-label={ui.aria.aboutVerbSource}
                className={[
                  'inline-flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors',
                  'border-primary-darkest bg-primary text-primary-text/80',
                  'hover:bg-primary-darker hover:text-primary-text',
                  sourceHelpOpen
                    ? 'border-primary-text/40 bg-primary-darker text-primary-text'
                    : '',
                ].join(' ')}
              >
                <QuestionMarkCircledIcon className="size-5" aria-hidden />
              </button>
            </div>
            {sourceHelpOpen ? (
              <div className="col-span-2 rounded-lg border border-primary-darkest bg-primary px-3 py-3">
                <SourceHelpPanel allVerbs={sourceIsAllVerbs} description={form.description} />
              </div>
            ) : null}
            <LevelConfigRow
              label={ui.prepare.rowLevels}
              selected={form.levels}
              options={options.level}
              labelMap={labels.level}
              onToggle={toggleLevel}
            />
            <ConfigRow
              label={ui.prepare.rowDirection}
              value={form.direction}
              options={options.direction}
              labelMap={labels.direction}
              onSelect={setDirection}
            />
            {hasExtraChoices ? (
              <ConfigRow
                label={ui.prepare.rowExtra}
                value={form.extra}
                options={options.extra}
                labelMap={labels.extra}
                onSelect={setExtra}
              />
            ) : null}
            {form.extra === 'conjugation' && (
              <ConfigRow
                label={ui.prepare.rowConjugation}
                value={form.conjugation}
                options={options.conjugation}
                labelMap={labels.conjugation}
                onSelect={setConjugation}
              />
            )}
            {(form.extra === 'conjugation' || form.extra === 'forms') && (
              <ConfigRow
                label={ui.prepare.rowRegularity}
                value={form.regularity}
                options={options.regularity}
                labelMap={labels.regularity}
                onSelect={setRegularity}
              />
            )}
            <ConfigRow
              label={ui.prepare.rowSpeed}
              value={form.speed}
              options={options.speed}
              labelMap={labels.speed}
              onSelect={setSpeed}
            />
            <ConfigRow
              label={ui.prepare.rowBatch}
              value={form.batch}
              options={options.batch}
              labelMap={labels.batch}
              onSelect={setBatch}
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl p-4">
          <p className="text-sm leading-relaxed text-primary-text/80">{ui.prepare.pickLanguageFirst}</p>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] border-t border-primary-darkest bg-primary-darkest p-4">
        <div className="mx-auto max-w-2xl">
          <Button
            onClick={handleStart}
            disabled={startDisabled}
            label={isStarting ? ui.prepare.starting : ui.prepare.startLesson}
            main
          />
        </div>
      </div>
    </div>
  )
}
