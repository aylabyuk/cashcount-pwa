import { formatCurrency } from '../../utils/currency'

interface Props {
  chequeLines: { envelopeNum: number; amount: number }[]
  chequesSubtotal: number
}

export default function ChequesTable({ chequeLines, chequesSubtotal }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Cheques</h3>
      </div>
      <div className="px-4">
        {chequeLines.length === 0 ? (
          <div className="py-2 text-sm text-gray-400 dark:text-gray-500">No cheques</div>
        ) : (
          <table className="w-full text-sm">
            <tbody className="text-gray-600 dark:text-gray-300">
              {chequeLines.map((line, i) => (
                <tr key={i} className={i > 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}>
                  <td className="py-1.5 text-gray-400 dark:text-gray-500">Env #{line.envelopeNum}</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(line.amount)}</td>
                </tr>
              ))}
            </tbody>
            {chequeLines.length > 1 && (
              <tfoot>
                <tr className="border-t border-gray-200 dark:border-gray-600 font-medium">
                  <td className="py-2">Cheques Subtotal</td>
                  <td className="py-2 text-right font-mono">{formatCurrency(chequesSubtotal)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>
    </div>
  )
}
