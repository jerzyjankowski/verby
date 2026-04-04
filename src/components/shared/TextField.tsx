import type { ChangeEvent, InputHTMLAttributes } from 'react'

import { ui } from '../../locales'

const textFieldClassName =
  'w-full min-w-0 rounded-lg border border-primary-darkest bg-primary px-3 py-2 text-primary-text placeholder:text-primary-text/50'

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  className?: string
}

export default function TextField({ className, onChange, value, ...props }: TextFieldProps) {
  const stringValue = value === undefined || value === null ? '' : String(value)
  const showClear = stringValue.length > 0

  const handleClear = () => {
    if (!onChange) return
    onChange({
      target: { value: '' },
      currentTarget: { value: '' },
    } as ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="relative min-w-0">
      <input
        className={[
          textFieldClassName,
          showClear ? 'pr-9' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        value={value}
        onChange={onChange}
        {...props}
      />
      {showClear ? (
        <button
          type="button"
          className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-primary-text/70 transition-colors hover:bg-primary-darker hover:text-primary-text"
          aria-label={ui.aria.clearTextField}
          onClick={handleClear}
        >
          <span className="text-lg leading-none" aria-hidden>
            ×
          </span>
        </button>
      ) : null}
    </div>
  )
}
