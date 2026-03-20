import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
  label?: string
  icon?: ReactNode
  fullWidth?: boolean
  main?: boolean
}

export default function Button({ label, icon, fullWidth = true, main = false, type = 'button', ...props }: ButtonProps) {
  const hasOnlyIcon = !!icon && !label

  return (
    <button
      type={type}
      className={[
        ' border border-primary-darkest  rounded-lg px-3 py-2 transition-colors',
        main ? 'text-reverted-text bg-reverted hover:bg-reverted-darker' : 'text-primary-text bg-primary hover:bg-primary-darker',
        'verby-button cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        label && fullWidth ? 'w-full' : '',
        hasOnlyIcon ? 'inline-flex size-10 items-center justify-center rounded-full px-0 py-0' : '',
        icon && label ? 'flex flex-row items-center gap-2' : ''
      ].join(' ')}
      {...props}
    >
      {icon ? <span>{icon}</span> : null}
      {label ? <span>{label}</span> : null}
    </button>
  )
}
