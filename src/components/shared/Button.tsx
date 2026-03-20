import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
  label?: string
  icon?: ReactNode
}

export default function Button({ label, icon, type = 'button', ...props }: ButtonProps) {
  const hasOnlyIcon = !!icon && !label

  return (
    <button
      type={type}
      className={[
        'verby-button cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary-darker',
        label ? 'w-full' : '',
        hasOnlyIcon ? 'inline-flex size-10 items-center justify-center rounded-full px-0 py-0' : '',
      ].join(' ')}
      {...props}
    >
      {label ? <span>{label}</span> : null}
      {icon ? <span className={label ? 'ml-2 inline-flex' : 'inline-flex'}>{icon}</span> : null}
    </button>
  )
}
