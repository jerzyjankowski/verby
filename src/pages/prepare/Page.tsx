import { type ReactNode } from 'react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'

import Button from '../../components/shared/Button.tsx'
import Dropdown from '../../components/shared/Dropdown.tsx'
import type { DropdownItem } from '../../components/shared/types.ts'
import Confirmation from '../../components/lesson/settings/Confirmation.tsx'
import Sheet from '../../components/shared/Sheet.tsx'
import { usePrepareLesson } from '../../hooks/usePrepareLesson.ts'
import type { LessonConfig } from '../../types/config.ts'
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
        This lesson will include <strong>{lessonVerbCount}</strong>{' '}
        {lessonVerbCount === 1 ? 'verb' : 'verbs'}.
      </p>
      <p>
        <strong>{availableVerbCountBeforeBatch}</strong>{' '}
        {availableVerbCountBeforeBatch === 1 ? 'verb' : 'verbs'} matched your filters.
      </p>
      {shortfall ? (
        <p>
          You selected a batch of <strong>{batch}</strong>, but only{' '}
          <strong>{availableVerbCountBeforeBatch}</strong>{' '}
          {availableVerbCountBeforeBatch === 1 ? 'verb' : 'verbs'} matched your settings, so the
          lesson has fewer cards than that batch size.
        </p>
      ) : null}
    </>
  )
}

function NoVerbsFoundSheetBody(): ReactNode {
  return (
    <p>
      You cannot start a lesson without any verbs. Change your filters so at least one verb matches.
    </p>
  )
}

function ConfigRow({
  label,
  value,
  options,
  labelMap,
  onSelect,
}: {
  label: string
  value: string | number | undefined
  options: readonly (string | number)[]
  labelMap: Record<string, string>
  onSelect: (key: string) => void
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
      placeholder="Select…"
      items={items}
      align="start"
    />
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
    setLevel,
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

  const sheetHasVerbs = pendingStart ? pendingStart.lesson.verbs.length > 0 : false

  return (
    <div className="min-h-screen bg-primary text-primary-text p-4">
      {pendingStart ? (
        <Sheet
          open={startConfirmOpen}
          onOpenChange={handleStartConfirmOpenChange}
          title={sheetHasVerbs ? 'Start lesson?' : 'No verbs found'}
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
            confirmLabel="Start lesson"
            cancelLabel="Back"
            confirmDisabled={!sheetHasVerbs}
          />
        </Sheet>
      ) : null}

      <div className="mx-auto max-w-2xl">
        <div className="verby-card grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4 p-4 bg-primary-darkest">
          <ConfigRow
            label="language:"
            value={form.language}
            options={options.language}
            labelMap={labels.language}
            onSelect={setLanguage}
          />
          <ConfigRow
            label="level:"
            value={form.level}
            options={options.level}
            labelMap={labels.level}
            onSelect={setLevel}
          />
          <ConfigRow
            label="direction:"
            value={form.direction}
            options={options.direction}
            labelMap={labels.direction}
            onSelect={setDirection}
          />
          {hasExtraChoices ? (
            <ConfigRow
              label="extra:"
              value={form.extra}
              options={options.extra}
              labelMap={labels.extra}
              onSelect={setExtra}
            />
          ) : null}
          {form.extra === 'conjugation' && (
            <ConfigRow
              label="conjugation:"
              value={form.conjugation}
              options={options.conjugation}
              labelMap={labels.conjugation}
              onSelect={setConjugation}
            />
          )}
          {(form.extra === 'conjugation' || form.extra === 'forms') && (
            <ConfigRow
              label="regularity:"
              value={form.regularity}
              options={options.regularity}
              labelMap={labels.regularity}
              onSelect={setRegularity}
            />
          )}
          <ConfigRow
            label="speed:"
            value={form.speed}
            options={options.speed}
            labelMap={labels.speed}
            onSelect={setSpeed}
          />
          <ConfigRow
            label="batch:"
            value={form.batch}
            options={options.batch}
            labelMap={labels.batch}
            onSelect={setBatch}
          />

          <div className="col-span-2 mt-4 flex items-center gap-3">
            <Button onClick={() => navigate(MAIN_PAGE_URL)} label="Back" icon={<ArrowLeftIcon className="size-4" />} fullWidth={false} />
            <Button
              onClick={handleStart}
              disabled={startDisabled}
              label={isStarting ? 'Starting...' : 'Start lesson'}
              main
            />
          </div>
        </div>
      </div>
    </div>
  )
}
