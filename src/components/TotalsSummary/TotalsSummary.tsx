import { useMemo, useState, useRef, useCallback } from 'react'
import { type CountingSession, getSessionTotals } from '../../store/sessionsSlice'
import BillsTable from './BillsTable'
import CoinsCard from './CoinsCard'
import ChequesTable from './ChequesTable'
import GrandTotalCard from './GrandTotalCard'
import DepositBreakdownModal from './DepositBreakdownModal'

interface Props {
  session: CountingSession
}

export default function TotalsSummary({ session }: Props) {
  const totals = getSessionTotals(session)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const denomCounts: Record<number, number> = {
    100: totals.total100,
    50: totals.total50,
    20: totals.total20,
    10: totals.total10,
    5: totals.total5,
  }

  const chequeLines = useMemo(() => {
    const lines: { envelopeNum: number; amount: number }[] = []
    const sorted = [...session.envelopes].sort((a, b) => a.number - b.number)
    sorted.forEach((e, i) => {
      if (e.chequeAmount > 0) {
        lines.push({ envelopeNum: i + 1, amount: e.chequeAmount })
      }
    })
    return lines
  }, [session.envelopes])

  const startLongPress = useCallback(() => {
    longPressTimer.current = setTimeout(() => setShowBreakdown(true), 500)
  }, [])

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  return (
    <div className="space-y-3">
      <div
        onTouchStart={startLongPress}
        onTouchEnd={cancelLongPress}
        onTouchMove={cancelLongPress}
        onDoubleClick={() => setShowBreakdown(true)}
        onContextMenu={(e) => e.preventDefault()}
        className="cursor-pointer"
      >
        <BillsTable denomCounts={denomCounts} cashSubtotal={totals.totalCash} />
      </div>

      <CoinsCard total={totals.totalCoins} />

      <ChequesTable chequeLines={chequeLines} chequesSubtotal={totals.totalCheques} />

      <GrandTotalCard total={totals.grandTotal} />

      <DepositBreakdownModal
        open={showBreakdown}
        date={session.date}
        denomCounts={denomCounts}
        cashSubtotal={totals.totalCash}
        coinsTotal={totals.totalCoins}
        chequesTotal={totals.totalCheques}
        onClose={() => setShowBreakdown(false)}
      />
    </div>
  )
}
