import type { InputHTMLAttributes } from 'react'

const textFieldClassName =
  'w-full min-w-0 rounded-lg border border-primary-darkest bg-primary px-3 py-2 text-primary-text placeholder:text-primary-text/50'

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  className?: string
}

export default function TextField({ className, ...props }: TextFieldProps) {
  return (
    <input
      className={[textFieldClassName, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}
