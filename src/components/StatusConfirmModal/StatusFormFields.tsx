const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'

interface ReportPrintedFieldsProps {
  type: 'report_printed'
  batchNumber: string
  onBatchNumberChange: (value: string) => void
}

interface DepositedFieldsProps {
  type: 'deposited'
  name1: string
  name2: string
  onName1Change: (value: string) => void
  onName2Change: (value: string) => void
}

interface NoDonationsFieldsProps {
  type: 'no_donations'
  reason: string
  onReasonChange: (value: string) => void
}

type Props = ReportPrintedFieldsProps | DepositedFieldsProps | NoDonationsFieldsProps

export default function StatusFormFields(props: Props) {
  if (props.type === 'report_printed') {
    return (
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Batch Number
        </label>
        <input
          type="text"
          value={props.batchNumber}
          onChange={(e) => props.onBatchNumberChange(e.target.value)}
          placeholder="e.g. 81014103"
          className={inputClass}
          autoFocus
        />
      </div>
    )
  }

  if (props.type === 'deposited') {
    return (
      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Depositor 1
          </label>
          <input
            type="text"
            value={props.name1}
            onChange={(e) => props.onName1Change(e.target.value)}
            placeholder="Full name"
            className={inputClass}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Depositor 2
          </label>
          <input
            type="text"
            value={props.name2}
            onChange={(e) => props.onName2Change(e.target.value)}
            placeholder="Full name"
            className={inputClass}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        Reason
      </label>
      <textarea
        value={props.reason}
        onChange={(e) => props.onReasonChange(e.target.value)}
        placeholder="e.g. Ward conference, stake event, no meeting held..."
        rows={2}
        className={`${inputClass} resize-none`}
        autoFocus
      />
    </div>
  )
}
