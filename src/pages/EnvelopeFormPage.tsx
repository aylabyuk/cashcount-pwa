import { useParams, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store'
import { updateEnvelope, getEnvelopeCashTotal } from '../store/sessionsSlice'
import { isSessionLocked } from '../utils/date'
import { formatCurrency } from '../utils/currency'
import DenominationRow from '../components/DenominationRow'
import CurrencyField from '../components/CurrencyField'

export default function EnvelopeFormPage() {
  const { id: sessionId, envelopeId } = useParams<{ id: string; envelopeId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const session = useAppSelector((s) => s.sessions.sessions.find((s) => s.id === sessionId))
  const envelope = session?.envelopes.find((e) => e.id === envelopeId)

  if (!session || !envelope) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <p>Envelope not found.</p>
        <button onClick={() => navigate(-1)} className="mt-2 text-blue-600 dark:text-blue-400">
          Go back
        </button>
      </div>
    )
  }

  const locked = isSessionLocked(session.date)

  function update(changes: Record<string, number>) {
    dispatch(updateEnvelope({ sessionId: session!.id, envelopeId: envelope!.id, changes }))
  }

  const cashTotalCents = getEnvelopeCashTotal(envelope)
  const totalCents = cashTotalCents + envelope.coinsAmount + envelope.chequeAmount

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Envelope #{envelope.number}</h2>

      {/* Cash Bills */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Cash Bills</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3">
          <DenominationRow denomination={100} count={envelope.count100} onChange={(v) => update({ count100: v })} disabled={locked} />
          <DenominationRow denomination={50} count={envelope.count50} onChange={(v) => update({ count50: v })} disabled={locked} />
          <DenominationRow denomination={20} count={envelope.count20} onChange={(v) => update({ count20: v })} disabled={locked} />
          <DenominationRow denomination={10} count={envelope.count10} onChange={(v) => update({ count10: v })} disabled={locked} />
          <DenominationRow denomination={5} count={envelope.count5} onChange={(v) => update({ count5: v })} disabled={locked} />
        </div>
      </div>

      {/* Coins */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Coins</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3">
          <CurrencyField label="Coins" cents={envelope.coinsAmount} onChange={(v) => update({ coinsAmount: v })} disabled={locked} />
        </div>
      </div>

      {/* Cheques */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Cheques</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3">
          <CurrencyField label="Cheque" cents={envelope.chequeAmount} onChange={(v) => update({ chequeAmount: v })} disabled={locked} />
        </div>
      </div>

      {/* Summary */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Summary</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex justify-between py-2 text-sm">
            <span>Cash</span>
            <span className="font-mono">{formatCurrency(cashTotalCents)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span>Coins</span>
            <span className="font-mono">{formatCurrency(envelope.coinsAmount)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span>Cheque</span>
            <span className="font-mono">{formatCurrency(envelope.chequeAmount)}</span>
          </div>
          <div className="flex justify-between py-3 font-bold">
            <span>Envelope Total</span>
            <span className="text-lg font-mono">{formatCurrency(totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
