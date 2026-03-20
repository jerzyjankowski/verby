import type {Round, UpdateRoundHiddenFlags} from '../../types/lesson.ts'

type CardsProps = {
  round?: Round
  updateRoundHiddenFlags: UpdateRoundHiddenFlags
}

export default function Cards({ round, updateRoundHiddenFlags }: CardsProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="bg-primary-darker border border-primary-darkest rounded-xl flex flex-1 items-center justify-center p-4">
        <p className="text-center text-2xl font-semibold">{round?.question ?? ''}</p>
      </div>

      <div
        className="bg-primary-darker border border-primary-darkest rounded-xl flex flex-1 items-center justify-center p-4"
        onClick={() => {updateRoundHiddenFlags(false, round?.conjugationAnswersHidden)}}
      >
        {!round.answerHidden && <p className="text-center text-2xl font-semibold">{round?.answer ?? ''}</p>}
      </div>
    </div>
  )
}
