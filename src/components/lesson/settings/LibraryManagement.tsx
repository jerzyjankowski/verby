import Button from '../../shared/Button.tsx'

const LIBRARY_ACTIONS = [
  'Create new save',
  'Edit current save',
  'Add to other save',
  'Replace other save',
  'Remove from save',
] as const

export default function LibraryManagement() {
  return (
    <div className="flex flex-col gap-2">
      {LIBRARY_ACTIONS.map((name) => (
        <Button key={name} label={name} onClick={() => console.log(name)} />
      ))}
    </div>
  )
}
