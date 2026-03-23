import { useEffect, useRef, useState } from 'react'

import { MOTIVATIONAL_QUOTES } from '../../locales'

function getRandomQuoteIndex(except?: number): number {
  if (MOTIVATIONAL_QUOTES.length <= 1) return 0
  let next = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  while (next === except) {
    next = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  }
  return next
}

export default function RandomQuote() {
  const [quoteIndex, setQuoteIndex] = useState<number>(() => getRandomQuoteIndex())
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const outTimerRef = useRef<number | null>(null)
  const iconSrc = `${import.meta.env.BASE_URL}android-chrome-192x192.png`

  const quote = MOTIVATIONAL_QUOTES[quoteIndex] ?? MOTIVATIONAL_QUOTES[0]

  useEffect(() => {
    return () => {
      if (outTimerRef.current !== null) {
        window.clearTimeout(outTimerRef.current)
      }
    }
  }, [])

  const showAnotherQuote = () => {
    if (phase !== 'idle') return
    setPhase('out')
    outTimerRef.current = window.setTimeout(() => {
      const nextIndex = getRandomQuoteIndex(quoteIndex)
      setQuoteIndex(nextIndex)
      setPhase('in')
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setPhase('idle'))
      })
    }, 480)
  }

  return (
    <>
      <div
        className={[
          'pointer-events-none fixed left-1/2 top-1/2 z-[var(--z-sticky)] w-[min(92vw,36rem)] px-4 text-center',
          '[transform:translate(-50%,calc(-100%-2.1rem))]',
          'transition-opacity duration-500 ease-in-out',
          phase === 'out' ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        <p className="text-base leading-relaxed text-primary-text">"{quote.text}"</p>
        <p className="mt-2 text-xs text-primary-text/70">- {quote.author}</p>
      </div>

      <img
        src={iconSrc}
        alt="Show another quote"
        title="Show another quote"
        onClick={phase === 'idle' ? showAnotherQuote : undefined}
        onKeyDown={(e) => {
          if (phase !== 'idle') return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            showAnotherQuote()
          }
        }}
        role="button"
        tabIndex={0}
        aria-disabled={phase !== 'idle'}
        className={[
          'fixed left-1/2 top-1/2 z-[var(--z-sticky)] h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-primary-darkest object-cover transition-transform',
          phase === 'idle' ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50',
        ].join(' ')}
      />
    </>
  )
}
