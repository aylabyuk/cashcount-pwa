import { type CountingSession, getSessionTotals } from '../../store/sessionsSlice'
import { formatDate } from '../../utils/date'
import { formatCurrency } from '../../utils/currency'
import { getSessionParticipants } from '../../utils/session'
import ParticipantAvatars, { type ParticipantInfo } from '../ParticipantAvatars'

interface Props {
  session: CountingSession
  isSelected: boolean
  onSelect: (id: string) => void
  members?: Map<string, ParticipantInfo>
}

export default function SessionListItem({ session, isSelected, onSelect, members }: Props) {
  const totals = getSessionTotals(session)
  const status = session.status
  const participants = getSessionParticipants(session)

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
            {status === 'recorded' && (
              <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                Recorded
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
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {session.envelopes.length} envelope(s)
            </span>
            {participants.length > 0 && (
              <ParticipantAvatars emails={participants} members={members} />
            )}
          </div>
        </div>
        <span className="text-lg font-semibold">
          {formatCurrency(totals.grandTotal)}
        </span>
      </div>
    </button>
  )
}
