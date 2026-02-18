interface Props {
  reason?: string
  recordedAt?: string
  canReactivate: boolean
  onReactivate: () => void
}

export default function NoDonationsView({
  reason,
  recordedAt,
  canReactivate,
  onReactivate,
}: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4m16 0l-4-4m4 4l-4 4" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">No Donations Received</p>
      {reason && (
        <p className="text-xs text-gray-400 dark:text-gray-500 max-w-55 italic">
          &ldquo;{reason}&rdquo;
        </p>
      )}
      {recordedAt && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          {new Date(recordedAt).toLocaleString()}
        </p>
      )}
      {canReactivate && (
        <button
          onClick={onReactivate}
          className="mt-6 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Reactivate Session
        </button>
      )}
    </div>
  )
}
