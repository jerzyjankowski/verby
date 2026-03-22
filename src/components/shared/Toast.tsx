import { Cross1Icon } from '@radix-ui/react-icons'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'

import { ui } from '../../locales/index.ts'

type ToastVariant = 'error' | 'success'

type ToastMessage = {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

type ToastContextValue = {
  error: (title: string, description?: string) => void
  success: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const error = useCallback((title: string, description?: string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setMessages((current) => [...current, { id, title, description, variant: 'error' }])
  }, [])

  const success = useCallback((title: string, description?: string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setMessages((current) => [...current, { id, title, description, variant: 'success' }])
  }, [])

  const removeMessage = useCallback((id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id))
  }, [])

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      error,
      success,
    }),
    [error, success],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}

        {messages.map((message) => (
          <ToastPrimitive.Root
            key={message.id}
            open
            duration={5000}
            onOpenChange={(open) => {
              if (!open) removeMessage(message.id)
            }}
            className={[
              'verby-card data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] bg-primary-darker p-3 pr-2 shadow-lg',
              message.variant === 'error' ? 'border-functional-error' : 'border-functional-success',
            ].join(' ')}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 pr-1">
                <ToastPrimitive.Title
                  className={`text-sm font-semibold ${
                    message.variant === 'error' ? 'text-text-error' : 'text-text-success'
                  }`}
                >
                  {message.title}
                </ToastPrimitive.Title>
                {message.description ? (
                  <ToastPrimitive.Description className="mt-1 text-sm text-primary-text">
                    {message.description}
                  </ToastPrimitive.Description>
                ) : null}
              </div>
              <ToastPrimitive.Close
                aria-label={ui.aria.dismissNotification}
                className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary-darkest text-primary-text transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-text/25"
              >
                <Cross1Icon className="size-3.5" />
              </ToastPrimitive.Close>
            </div>
          </ToastPrimitive.Root>
        ))}

        <ToastPrimitive.Viewport className="fixed right-2 bottom-2 z-[var(--z-toast)] flex w-[calc(100vw-1rem)] max-w-sm flex-col gap-2 outline-none sm:right-4 sm:bottom-4 sm:w-full" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
