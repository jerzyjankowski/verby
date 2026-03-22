import { useMemo } from 'react'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

import type { LessonSave } from '../../../types/config.ts'
import type { Verb } from '../../../types/verb.ts'
import { ui } from '../../../locales/index.ts'

type HistoryViewProps = {
  lesson: LessonSave
  verbs: Verb[]
  lastVerbsIds: number[]
  onVerbSelect?: (verbId: number) => void
}

export default function HistoryView({ lesson, verbs, lastVerbsIds, onVerbSelect }: HistoryViewProps) {
  const historyRows = useMemo(() => {
    const verbsById = new Map(verbs.map((verb) => [verb.id, verb]))
    const learntById = new Map(lesson.verbs.map((id, index) => [id, lesson.learnt[index] ?? false]))
    const lastIndexById = new Map<number, number>()
    const appearancesById = new Map<number, number>()

    lastVerbsIds.forEach((id, index) => {
      lastIndexById.set(id, index)
    })

    return lastVerbsIds
      .map((id, index) => {
        const appeared = (appearancesById.get(id) ?? 0) + 1
        appearancesById.set(id, appeared)
        const v = verbsById.get(id)

        return {
          order: index + 1,
          id,
          level: v?.level ?? '-',
          verb: v?.verb ?? '-',
          appeared,
          learnt: lastIndexById.get(id) === index && (learntById.get(id) ?? false),
        }
      })
      .reverse()
  }, [lastVerbsIds, lesson, verbs])

  return (
    <div className="overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker">
      <table className="w-full text-left text-sm">
        <tbody>
          {historyRows.map((row, index) => (
            <tr
              key={`${row.order}-${row.id}-${index}`}
              className={[
                'border-b border-primary-darkest last:border-b-0',
                onVerbSelect ? 'cursor-pointer transition-colors hover:bg-primary' : '',
              ].join(' ')}
              onClick={onVerbSelect ? () => onVerbSelect(row.id) : undefined}
            >
              <td className="w-px whitespace-nowrap px-3 py-2 text-right tabular-nums">{row.order}</td>
              <td className="w-px whitespace-nowrap px-3 py-2 text-right tabular-nums">{row.id}</td>
              <td className="w-px whitespace-nowrap px-3 py-2">{row.level}</td>
              <td className="px-3 py-2">{row.verb}</td>
              <td className="w-px whitespace-nowrap px-3 py-2 text-right tabular-nums">×{row.appeared}</td>
              <td className="w-px whitespace-nowrap px-3 py-2">
                {row.learnt ? (
                  <CheckIcon aria-label={ui.aria.learntOnLastAppearance} className="size-4" />
                ) : (
                  <Cross2Icon aria-label={ui.aria.notLastAppearance} className="size-4" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
