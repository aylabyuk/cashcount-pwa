import { type CountingSession, getSessionTotals } from '../../store/sessionsSlice'
import { formatDate } from '../../utils/date'
import { formatCurrency } from '../../utils/currency'

interface Props {
  session: CountingSession
  isSelected: boolean
  onSelect: (id: string) => void
}

export default function SessionListItem({ session, isSelected, onSelect }: Props) {
  const totals = getSessionTotals(session)
  const status = session.status

  return (
    <button
      onClick={() => onSelect(session.id)}
      className={`w-full text-left rounded-lg border px-4 py-3 ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-black/2 dark:hover:bg-white/2 active:bg-black/4 dark:active:bg-white/4'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">{formatDate(session.date)}</span>
            {status === 'report_printed' && (
              <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                Printed
              </span>
            )}
            {status === 'deposited' && (
              <span className="text-[10px] font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">
                Deposited
              </span>
            )}
            {status === 'no_donations' && (
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                No Donations
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {session.envelopes.length} envelope(s)
          </span>
        </div>
        <span className="text-lg font-semibold font-mono">
          {formatCurrency(totals.grandTotal)}
        </span>
      </div>
    </button>
  )
}
