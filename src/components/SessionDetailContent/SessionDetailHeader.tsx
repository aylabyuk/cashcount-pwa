import { useState, useRef, useEffect } from 'react'

interface Props {
  date: string
  envelopeCount: number
  badge?: { label: string; className: string }
  editable: boolean
  isPanel: boolean
  status: string
  canReactivate: boolean
  onAdd: () => void
  onPrint: () => void
  onMarkRecorded: () => void
  onMarkDeposited: () => void
  onMarkNoDonations: () => void
  onReactivate: () => void
}

export default function SessionDetailHeader({
  date,
  envelopeCount,
  badge,
  editable,
  isPanel,
  status,
  canReactivate,
  onAdd,
  onPrint,
  onMarkRecorded,
  onMarkDeposited,
  onMarkNoDonations,
  onReactivate,
}: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showMenu) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMenu])

  const showMenuButton = status !== 'no_donations'

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">
        {date} ({envelopeCount})
      </h2>
      <div className="flex items-center gap-2">
        {badge && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.className}`}>
            {badge.label}
          </span>
        )}
        {isPanel && editable && (
          <button
            onClick={onAdd}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Add Envelope
          </button>
        )}
        {showMenuButton && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-30">
                <button
                  onClick={() => { setShowMenu(false); onPrint() }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  Print Report
                </button>
                {status === 'active' && (
                  <>
                    <button
                      onClick={() => { setShowMenu(false); onMarkRecorded() }}
                      className="w-full text-left px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      Mark Session Recorded
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); onMarkNoDonations() }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      No Donations
                    </button>
                  </>
                )}
                {status === 'recorded' && (
                  <button
                    onClick={() => { setShowMenu(false); onMarkDeposited() }}
                    className="w-full text-left px-4 py-2.5 text-sm text-green-700 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    Mark as Deposited
                  </button>
                )}
                {canReactivate && (
                  <button
                    onClick={() => { setShowMenu(false); onReactivate() }}
                    className="w-full text-left px-4 py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    Reactivate Session
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
