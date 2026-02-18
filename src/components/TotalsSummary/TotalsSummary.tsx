import { useMemo } from 'react'
import { type CountingSession, getSessionTotals } from '../../store/sessionsSlice'
import BillsTable from './BillsTable'
import CoinsCard from './CoinsCard'
import ChequesTable from './ChequesTable'
import GrandTotalCard from './GrandTotalCard'

interface Props {
  session: CountingSession
}

export default function TotalsSummary({ session }: Props) {
  const totals = getSessionTotals(session)

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

  return (
    <div className="space-y-3">
      <BillsTable denomCounts={denomCounts} cashSubtotal={totals.totalCash} />

      <CoinsCard total={totals.totalCoins} />

      <ChequesTable chequeLines={chequeLines} chequesSubtotal={totals.totalCheques} />

      <GrandTotalCard total={totals.grandTotal} />
    </div>
  )
}
