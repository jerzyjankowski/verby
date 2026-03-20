import { useMemo } from 'react'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

import type { LessonSave } from '../../../types/config.ts'
import type { Verb } from '../../../types/verb.ts'

type VerbsViewProps = {
  lesson: LessonSave
  verbs: Verb[]
}

export default function VerbsView({ lesson, verbs }: VerbsViewProps) {
  const verbRows = useMemo(() => {
    const verbsById = new Map(verbs.map((verb) => [verb.id, verb]))

    return lesson.verbs
      .map((id, index) => ({
        id,
        verb: verbsById.get(id)?.verb ?? '-',
        repeated: lesson.repeated[index] ?? 0,
        learnt: lesson.learnt[index] ?? false,
      }))
      .sort((a, b) => a.id - b.id)
  }, [lesson, verbs])

  return (
    <div className="overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker">
      <table className="w-full text-left text-sm">
        <tbody>
          {verbRows.map((row) => (
            <tr key={row.id} className="border-b border-primary-darkest last:border-b-0">
              <td className="px-3 py-2 tabular-nums">{row.id}</td>
              <td className="px-3 py-2">{row.verb}</td>
              <td className="w-px whitespace-nowrap px-3 py-2 text-right tabular-nums">×{row.repeated}</td>
              <td className="w-px whitespace-nowrap px-3 py-2">
                {row.learnt ? (
                  <CheckIcon aria-label="Learnt" className="size-4" />
                ) : (
                  <Cross2Icon aria-label="Not learnt" className="size-4" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
