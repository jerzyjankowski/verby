import { useMemo } from 'react'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

import type { LessonSave } from '../../../types/config.ts'
import type { Verb } from '../../../types/verb.ts'

type VerbsViewProps = {
  lesson: LessonSave
  verbs: Verb[]
  onVerbSelect?: (verbId: number) => void
}

export default function VerbsView({ lesson, verbs, onVerbSelect }: VerbsViewProps) {
  const verbRows = useMemo(() => {
    const verbsById = new Map(verbs.map((verb) => [verb.id, verb]))

    return lesson.verbs
      .map((id, index) => {
        const v = verbsById.get(id)
        return {
          id,
          level: v?.level ?? '-',
          verb: v?.verb ?? '-',
          repeated: lesson.repeated[index] ?? 0,
          learnt: lesson.learnt[index] ?? false,
        }
      })
      .sort((a, b) => a.id - b.id)
  }, [lesson, verbs])

  return (
    <div className="overflow-hidden rounded-xl border border-primary-darkest bg-primary-darker">
      <table className="w-full text-left text-sm">
        <tbody>
          {verbRows.map((row) => (
            <tr
              key={row.id}
              className={[
                'border-b border-primary-darkest last:border-b-0',
                onVerbSelect ? 'cursor-pointer transition-colors hover:bg-primary' : '',
              ].join(' ')}
              onClick={onVerbSelect ? () => onVerbSelect(row.id) : undefined}
            >
              <td className="w-px whitespace-nowrap py-2 pl-3 pr-1 text-right tabular-nums">{row.id}</td>
              <td className="w-px whitespace-nowrap px-3 py-2 text-right">{row.level}</td>
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
