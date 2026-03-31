import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label?: string
  icon?: ReactNode
  fullWidth?: boolean
  main?: boolean
  rounded?: boolean
  bigger?: boolean
}

export default function Button({
  label,
  icon,
  fullWidth = true,
  main = false,
  rounded = false,
  type = 'button',
  className,
  bigger,
  ...props
}: ButtonProps) {
  const hasOnlyIcon = !!icon && !label

  return (
    <button
      type={type}
      className={[
        ' border border-primary-darkest  rounded-lg px-3 transition-colors',
        bigger ? 'py-4' : 'py-2',
        main ? 'text-reverted-text bg-reverted hover:bg-reverted-darker' : 'text-primary-text bg-primary hover:bg-primary-darker',
        'verby-button cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        fullWidth ? 'w-full' : '',
        hasOnlyIcon
          ? fullWidth
            ? `flex ${bigger ? 'h-14' : 'h-10'} items-center justify-center px-0 py-0 ${rounded ? 'rounded-full' : 'rounded-lg'}`
            : `inline-flex size-10 items-center justify-center px-0 py-0 ${rounded ? 'rounded-full' : 'rounded-lg'}`
          : '',
        icon && label ? 'flex flex-row items-center gap-2' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {icon ? <span>{icon}</span> : null}
      {label ? <span>{label}</span> : null}
    </button>
  )
}
