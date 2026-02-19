import { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { type CountingSession, getSessionTotals } from '../../store/sessionsSlice'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { BILL_DENOMINATIONS } from '../../utils/constants'

interface Props {
  session: CountingSession
  unitName?: string
  printedBy?: string
}

export default function PrintableReport({ session, unitName, printedBy }: Props) {
  const totals = getSessionTotals(session)

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

  return createPortal(
    <div className="printable-report">
      {/* Header */}
      <div style={{ borderBottom: '2px solid #000', paddingBottom: 8, marginBottom: 16 }}>
        {unitName && <div style={{ fontSize: 18, fontWeight: 700 }}>{unitName}</div>}
        <div style={{ fontSize: 22, fontWeight: 700 }}>Donation Count Report</div>
        <div style={{ fontSize: 14, marginTop: 4 }}>
          Session Date: {formatDate(session.date)}
          {session.batchNumber && <span> &nbsp;|&nbsp; Batch #{session.batchNumber}</span>}
        </div>
      </div>

      {/* Bills Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #999' }}>
            <th style={{ textAlign: 'left', padding: '4px 0', fontSize: 12, textTransform: 'uppercase', color: '#666' }}>Denomination</th>
            <th style={{ textAlign: 'center', padding: '4px 0', fontSize: 12, textTransform: 'uppercase', color: '#666' }}>Count</th>
            <th style={{ textAlign: 'right', padding: '4px 0', fontSize: 12, textTransform: 'uppercase', color: '#666' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {BILL_DENOMINATIONS.map((d) => {
            const count = totals[`total${d}` as keyof typeof totals] as number
            return (
              <tr key={d} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '6px 0' }}>${d}</td>
                <td style={{ padding: '6px 0', textAlign: 'center' }}>{count}</td>
                <td style={{ padding: '6px 0', textAlign: 'right' }}>{formatCurrency(count * d * 100)}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: '2px solid #000' }}>
            <td style={{ padding: '8px 0', fontWeight: 700 }} colSpan={2}>Cash Subtotal</td>
            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>{formatCurrency(totals.totalCash)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Coins */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
        <span style={{ fontWeight: 600 }}>Coins</span>
        <span style={{ fontWeight: 700 }}>{formatCurrency(totals.totalCoins)}</span>
      </div>

      {/* Cheques */}
      <div style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: chequeLines.length > 0 ? 8 : 0 }}>
          <span style={{ fontWeight: 600 }}>Cheques</span>
          <span style={{ fontWeight: 700 }}>{formatCurrency(totals.totalCheques)}</span>
        </div>
        {chequeLines.length > 0 && (
          <div style={{ paddingLeft: 16, fontSize: 13, color: '#666' }}>
            {chequeLines.map((line) => (
              <div key={line.envelopeNum} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Envelope #{line.envelopeNum}</span>
                <span>{formatCurrency(line.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '3px double #000', marginTop: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 700 }}>Grand Total</span>
        <span style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(totals.grandTotal)}</span>
      </div>

      {/* Envelope count */}
      <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>
        {session.envelopes.length} envelope(s) counted
      </div>

      {/* Deposit info */}
      {session.depositedBy && (
        <div style={{ marginTop: 16, padding: '8px 0', borderTop: '1px solid #ccc', fontSize: 13 }}>
          <div>Deposited by <strong>{session.depositedBy[0]}</strong> and <strong>{session.depositedBy[1]}</strong></div>
          {session.depositedAt && (
            <div style={{ color: '#666' }}>{new Date(session.depositedAt).toLocaleString()}</div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 32, paddingTop: 8, borderTop: '1px solid #ccc', fontSize: 11, color: '#999' }}>
        Printed {new Date().toLocaleString()}
        {printedBy && <span> by {printedBy}</span>}
      </div>
    </div>,
    document.body
  )
}
