interface Props {
  mode: 'add' | 'edit'
  title: string
  disabled: boolean
  hasChanges: boolean
  adding: boolean
  totalCents: number
  onClose: () => void
  onAdd: () => void
  onSave: () => void
}

export default function EnvelopeModalHeader({
  mode, title, disabled, hasChanges, adding, totalCents,
  onClose, onAdd, onSave,
}: Props) {
  return (
    <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        {mode === 'add' ? 'Cancel' : 'Close'}
      </button>
      <h2 className="text-base font-semibold">{title}</h2>
      {mode === 'add' ? (
        <button
          onClick={onAdd}
          disabled={totalCents === 0 || adding}
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:opacity-30 disabled:pointer-events-none"
        >
          Add
        </button>
      ) : !disabled ? (
        <button
          onClick={onSave}
          disabled={!hasChanges}
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:opacity-30 disabled:pointer-events-none"
        >
          Save
        </button>
      ) : (
        <div className="w-10" />
      )}
    </div>
  )
}
