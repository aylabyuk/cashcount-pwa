import { useRef, useEffect } from 'react'
import { useTransition, animated } from '@react-spring/web'
import { type Envelope, getEnvelopeTotal, getEnvelopeCashTotal } from '../../store/sessionsSlice'
import { formatCurrency } from '../../utils/currency'
import { SPRING_SNAPPY } from '../../utils/constants'

interface Props {
  sortedEnvelopes: Envelope[]
  displayIndex: Map<string, number>
  editable: boolean
  isPanel: boolean
  onEdit: (id: string) => void
  onDelete: (envelope: { id: string; number: number }) => void
  onAdd: () => void
}

export default function EnvelopeCards({
  sortedEnvelopes,
  displayIndex,
  editable,
  isPanel,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  const initialRef = useRef(true)
  useEffect(() => {
    initialRef.current = false
  }, [])

  const transitions = useTransition(sortedEnvelopes, {
    keys: (e) => e.id,
    from: initialRef.current
      ? { opacity: 1, transform: 'scale(1)', height: 'auto', marginBottom: 4, width: '20%' }
      : { opacity: 0, transform: 'scale(0.9)', height: 0, marginBottom: 0, width: '0%' },
    enter: initialRef.current
      ? { opacity: 1, transform: 'scale(1)', height: 'auto', marginBottom: 4, width: '20%' }
      : () => async (next) => {
            await new Promise((r) => setTimeout(r, 150))
            await next({ opacity: 1, transform: 'scale(1)', height: 'auto', marginBottom: 4, width: '20%' })
          },
    leave: { opacity: 0, transform: 'scale(0.9)', height: 0, marginBottom: 0, width: '0%' },
    config: SPRING_SNAPPY,
  })

  if (sortedEnvelopes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
        No envelopes yet.
      </div>
    )
  }

  if (isPanel) {
    return (
      <div className="flex flex-wrap -m-1">
        {transitions((style, envelope) => {
          const cashTotal = getEnvelopeCashTotal(envelope)
          return (
            <animated.div style={{ width: style.width, overflow: 'hidden' }}>
              <div className="p-1">
                <animated.div
                  style={{ opacity: style.opacity, transform: style.transform }}
                  className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-black/2 dark:hover:bg-white/2 group"
                >
                  <button
                    onClick={() => onEdit(envelope.id)}
                    className="w-full text-left p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">#{displayIndex.get(envelope.id)}</span>
                      {editable && <div className="w-5" />}
                    </div>
                    <span className="text-sm font-bold text-center block mt-1 mb-2">
                      {formatCurrency(getEnvelopeTotal(envelope))}
                    </span>
                    <div className="space-y-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                      <div className="flex justify-between"><span>Cash</span><span>{formatCurrency(cashTotal)}</span></div>
                      <div className="flex justify-between"><span>Coins</span><span>{formatCurrency(envelope.coinsAmount)}</span></div>
                      <div className="flex justify-between"><span>Cheque</span><span>{formatCurrency(envelope.chequeAmount)}</span></div>
                    </div>
                  </button>
                  {editable && (
                    <button
                      onClick={() => onDelete(envelope)}
                      className="absolute top-1.5 right-1.5 p-1 rounded text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </animated.div>
              </div>
            </animated.div>
          )
        })}
        {editable && (
          <div style={{ width: '20%' }}>
            <div className="p-1">
              <button
                onClick={onAdd}
                className="w-full min-h-[125.5px] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {transitions((style, envelope) => {
        const cashTotal = getEnvelopeCashTotal(envelope)
        return (
          <animated.div style={{ height: style.height, marginBottom: style.marginBottom, overflow: 'hidden' }}>
            <animated.div
              style={{ opacity: style.opacity, transform: style.transform }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center"
            >
              <button
                onClick={() => onEdit(envelope.id)}
                className="flex-1 text-left px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2 rounded-l-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Envelope #{displayIndex.get(envelope.id)}</span>
                  <span className="text-sm font-bold">
                    {formatCurrency(getEnvelopeTotal(envelope))}
                  </span>
                </div>
                <div className="flex gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                  <span>Cash {formatCurrency(cashTotal)}</span>
                  <span>Coins {formatCurrency(envelope.coinsAmount)}</span>
                  <span>Cheque {formatCurrency(envelope.chequeAmount)}</span>
                </div>
              </button>
              {editable && (
                <button
                  onClick={() => onDelete(envelope)}
                  className="px-3 py-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 border-l border-gray-200 dark:border-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </animated.div>
          </animated.div>
        )
      })}
    </div>
  )
}
