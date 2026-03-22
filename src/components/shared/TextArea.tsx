import type { TextareaHTMLAttributes } from 'react'

const textAreaClassName =
  'w-full min-w-0 min-h-[6rem] resize-y rounded-lg border border-primary-darkest bg-primary px-3 py-2 text-primary-text placeholder:text-primary-text/50'

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
  className?: string
}

export default function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={[textAreaClassName, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}
