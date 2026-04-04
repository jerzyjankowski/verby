import { useMemo, useState } from 'react'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import * as Switch from '@radix-ui/react-switch'
import { useNavigate } from 'react-router-dom'

import Button from '../../components/shared/Button.tsx'
import Dropdown from '../../components/shared/Dropdown.tsx'
import type { DropdownItem } from '../../components/shared/types.ts'
import {
  APPLICATION_LANGUAGE_OPTIONS,
  type ApplicationLanguage,
} from '../../consts/settings.ts'
import { MAIN_PAGE_URL } from '../../consts/urls.ts'
import { ui } from '../../locales'
import { readStoredSettings, writeStoredSettings } from '../../utils/settings.ts'

export default function Page() {
  const navigate = useNavigate()
  const stored = useMemo(() => readStoredSettings(), [])
  const [applicationLanguage, setApplicationLanguage] = useState<ApplicationLanguage>(
    () => stored.applicationLanguage,
  )
  const [showIrregularMarkBeforeAnswer, setShowIrregularMarkBeforeAnswer] = useState(
    () => stored.showIrregularMarkBeforeAnswer,
  )
  const [showIrregularMarkAfterAnswer, setShowIrregularMarkAfterAnswer] = useState(
    () => stored.showIrregularMarkAfterAnswer,
  )
  const [showLevel, setShowLevel] = useState(() => stored.showLevel)

  const dirty =
    applicationLanguage !== stored.applicationLanguage ||
    showIrregularMarkBeforeAnswer !== stored.showIrregularMarkBeforeAnswer ||
    showIrregularMarkAfterAnswer !== stored.showIrregularMarkAfterAnswer ||
    showLevel !== stored.showLevel

  const labelByLang: Record<ApplicationLanguage, string> = {
    EN: ui.settings.langEnglish,
    PL: ui.settings.langPolish,
  }

  const items: DropdownItem[] = APPLICATION_LANGUAGE_OPTIONS.map((lang) => ({
    key: lang,
    label: labelByLang[lang],
    onSelect: () => setApplicationLanguage(lang),
  }))

  const handleSave = () => {
    writeStoredSettings({
      ...stored,
      applicationLanguage,
      showIrregularMarkBeforeAnswer,
      showIrregularMarkAfterAnswer,
      showLevel,
    })
    window.location.reload()
  }

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
          <h1 className="min-w-0 flex-1 truncate text-lg font-medium">{ui.settings.title}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-4">
        <div className="verby-card grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4 bg-primary-darkest p-4">
          <span className="flex h-10 shrink-0 items-center self-start text-sm text-primary-text">
            {ui.settings.applicationLanguage}
          </span>
          <div className="min-w-0 self-start">
            <Dropdown
              selectedLabel={labelByLang[applicationLanguage]}
              placeholder={ui.prepare.selectPlaceholder}
              items={items}
              align="start"
            />
          </div>

          <h2 className="col-span-2 mt-2 border-t border-primary pt-4 text-sm font-semibold text-primary-text">
            {ui.settings.lessonCardSection}
          </h2>

          <label className="col-span-2 flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
            <span>{ui.settings.showLevel}</span>
            <Switch.Root
              checked={showLevel}
              onCheckedChange={setShowLevel}
              className="relative h-6 w-11 shrink-0 rounded-full bg-primary-darkest transition-colors data-[state=checked]:bg-primary-text"
            >
              <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </label>
          <label className="col-span-2 flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
            <span>{ui.settings.showIrregularMarkBeforeAnswer}</span>
            <Switch.Root
              checked={showIrregularMarkBeforeAnswer}
              onCheckedChange={setShowIrregularMarkBeforeAnswer}
              className="relative h-6 w-11 shrink-0 rounded-full bg-primary-darkest transition-colors data-[state=checked]:bg-primary-text"
            >
              <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </label>
          <label className="col-span-2 flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
            <span>{ui.settings.showIrregularMarkAfterAnswer}</span>
            <Switch.Root
              checked={showIrregularMarkAfterAnswer}
              onCheckedChange={setShowIrregularMarkAfterAnswer}
              className="relative h-6 w-11 shrink-0 rounded-full bg-primary-darkest transition-colors data-[state=checked]:bg-primary-text"
            >
              <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </label>

          <div className="col-span-2">
            <Button main disabled={!dirty} onClick={handleSave} label={ui.common.save} />
          </div>
        </div>
      </div>
    </div>
  )
}
