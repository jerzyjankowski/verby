import { useMemo } from 'react'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

import type { LessonSave } from '../../../types/config.ts'
import type { Verb } from '../../../types/verb.ts'

type HistoryViewProps = {
  lesson: LessonSave
  verbs: Verb[]
  lastVerbsIds: number[]
}

export default function HistoryView({ lesson, verbs, lastVerbsIds }: HistoryViewProps) {
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

        return {
          order: index + 1,
          id,
          verb: verbsById.get(id)?.verb ?? '-',
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
              className="border-b border-primary-darkest last:border-b-0"
            >
              <td className="px-3 py-2 tabular-nums">{row.order}</td>
              <td className="px-3 py-2 tabular-nums">{row.id}</td>
              <td className="px-3 py-2">{row.verb}</td>
              <td className="w-px whitespace-nowrap px-3 py-2 text-right tabular-nums">×{row.appeared}</td>
              <td className="w-px whitespace-nowrap px-3 py-2">
                {row.learnt ? (
                  <CheckIcon aria-label="Learnt on last appearance" className="size-4" />
                ) : (
                  <Cross2Icon aria-label="Not last appearance" className="size-4" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
