import DenominationRow from '../DenominationRow'
import CurrencyField from '../CurrencyField'

interface Props {
  count100: number
  count50: number
  count20: number
  count10: number
  count5: number
  coinsAmount: number
  chequeAmount: number
  onCount100Change: (v: number) => void
  onCount50Change: (v: number) => void
  onCount20Change: (v: number) => void
  onCount10Change: (v: number) => void
  onCount5Change: (v: number) => void
  onCoinsChange: (v: number) => void
  onChequeChange: (v: number) => void
  disabled: boolean
}

export default function EnvelopeFormBody({
  count100, count50, count20, count10, count5,
  coinsAmount, chequeAmount,
  onCount100Change, onCount50Change, onCount20Change, onCount10Change, onCount5Change,
  onCoinsChange, onChequeChange,
  disabled,
}: Props) {
  return (
    <>
      {/* Cash Bills */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Cash Bills</h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3">
          <DenominationRow denomination={100} count={count100} onChange={onCount100Change} disabled={disabled} />
          <DenominationRow denomination={50} count={count50} onChange={onCount50Change} disabled={disabled} />
          <DenominationRow denomination={20} count={count20} onChange={onCount20Change} disabled={disabled} />
          <DenominationRow denomination={10} count={count10} onChange={onCount10Change} disabled={disabled} />
          <DenominationRow denomination={5} count={count5} onChange={onCount5Change} disabled={disabled} />
        </div>
      </div>

      {/* Coins */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Coins</h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3">
          <CurrencyField label="Coins" cents={coinsAmount} onChange={onCoinsChange} disabled={disabled} />
        </div>
      </div>

      {/* Cheques */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Cheques</h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3">
          <CurrencyField label="Cheque" cents={chequeAmount} onChange={onChequeChange} disabled={disabled} />
        </div>
      </div>
    </>
  )
}
