import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { CheckCircledIcon } from '@radix-ui/react-icons'

type FwTone = 'primary' | 'error' | 'success'

type Burst = {
  left: string
  top: string
  delayMs: number
  durationMs: number
  count: number
  travelRem: number
  phaseDeg: number
  tone: FwTone
}

const BURST_COUNT = 32
/** Time between the start of one burst and the start of the next. */
const STAGGER_MS = 500
/** Full firework sequence restarts on this interval (32 × 500ms = 16s of staggered starts). */
const CYCLE_MS = 16_000

const TONES: FwTone[] = ['primary', 'error', 'success']

const FLASH_BY_TONE: Record<FwTone, string> = {
  primary: 'bg-primary-text/70',
  error: 'bg-text-error/68',
  success: 'bg-text-success/70',
}

const PARTICLE_BG_BY_TONE: Record<FwTone, string> = {
  primary: 'bg-primary-text',
  error: 'bg-text-error',
  success: 'bg-text-success',
}

function rnd(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function pickTone(): FwTone {
  return TONES[Math.floor(Math.random() * TONES.length)]!
}

function createRandomBursts(n: number): Burst[] {
  const bursts: Burst[] = []
  for (let i = 0; i < n; i++) {
    bursts.push({
      left: `${Math.round(rnd(6, 86))}%`,
      top: `${Math.round(rnd(6, 78))}%`,
      delayMs: i * STAGGER_MS + Math.round(rnd(-STAGGER_MS, STAGGER_MS)),
      durationMs: Math.round(rnd(2700, 3200)),
      count: 12 + Math.floor(Math.random() * 12),
      travelRem: Math.round(rnd(26, 54)) / 10,
      phaseDeg: Math.round(rnd(0, 359)),
      tone: pickTone(),
    })
  }
  return bursts
}

function FireworksBackground({ bursts }: { bursts: Burst[] }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
      aria-hidden
    >
      {bursts.map((burst, bi) => {
        const step = 360 / burst.count
        return (
          <div
            key={bi}
            className="absolute"
            style={{ left: burst.left, top: burst.top, width: 0, height: 0 }}
          >
            <span
              className={`verby-firework-flash ${FLASH_BY_TONE[burst.tone]}`}
              style={
                {
                  animationDuration: `${burst.durationMs}ms`,
                  animationDelay: `${burst.delayMs}ms`,
                } as CSSProperties
              }
            />
            {Array.from({ length: burst.count }, (_, i) => {
              const deg = burst.phaseDeg + i * step
              return (
                <span
                  key={i}
                  className={`verby-firework-particle ${PARTICLE_BG_BY_TONE[burst.tone]}`}
                  data-fw-tone={burst.tone}
                  style={
                    {
                      '--fw-deg': `${deg}deg`,
                      '--fw-travel': `${burst.travelRem}rem`,
                      animationDuration: `${burst.durationMs}ms`,
                      animationDelay: `${burst.delayMs}ms`,
                    } as CSSProperties
                  }
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default function LessonCelebration() {
  const [cycleId, setCycleId] = useState(0)

  const bursts = useMemo(() => createRandomBursts(BURST_COUNT), [cycleId])

  useEffect(() => {
    const id = window.setInterval(() => setCycleId((c) => c + 1), CYCLE_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden px-4 py-6 text-center">
      <FireworksBackground key={cycleId} bursts={bursts} />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="relative mb-6 flex size-28 shrink-0 items-center justify-center">
          <span
            className="absolute inset-2 rounded-full bg-text-success/25 animate-ping"
            style={{ animationDuration: '2.2s' }}
            aria-hidden
          />
          <div className="relative flex size-24 items-center justify-center rounded-full border-2 border-text-success/50 bg-text-success/15 shadow-[0_0_28px_-6px] shadow-text-success/35">
            <CheckCircledIcon
              className="size-14 text-text-success animate-[verby-celebrate-pop_0.55s_cubic-bezier(0.22,1,0.36,1)_both]"
              aria-hidden
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-primary-text">
          Lesson completed
        </h2>
        <p className="mt-2 max-w-xs text-sm text-primary-text/80">
          You have worked through every verb in this lesson.
        </p>

        <div className="mt-10 flex shrink-0 gap-2" aria-hidden>
          {(
            [
              'bg-primary-text/55',
              'bg-text-error/55',
              'bg-text-success/55',
              'bg-primary-text/45',
              'bg-text-success/45',
            ] as const
          ).map((cls, i) => (
            <span
              key={i}
              className={`size-2 rounded-full animate-bounce ${cls}`}
              style={{ animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
