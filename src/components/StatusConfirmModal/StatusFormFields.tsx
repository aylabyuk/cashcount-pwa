import type { Member } from '../../hooks/useMembers'
import MemberPicker from '../MemberPicker'

const inputClass = 'w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'

interface RecordedFieldsProps {
  type: 'recorded'
  batchNumber: string
  onBatchNumberChange: (value: string) => void
}

interface DepositedFieldsProps {
  type: 'deposited'
  members: Member[]
  depositor1Email: string
  depositor2Email: string
  onDepositor1Change: (email: string) => void
  onDepositor2Change: (email: string) => void
}

interface NoDonationsFieldsProps {
  type: 'no_donations'
  reason: string
  onReasonChange: (value: string) => void
}

type Props = RecordedFieldsProps | DepositedFieldsProps | NoDonationsFieldsProps

export default function StatusFormFields(props: Props) {
  if (props.type === 'recorded') {
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
        <MemberPicker
          label="Depositor 1"
          members={props.members}
          selectedEmail={props.depositor1Email}
          disabledEmail={props.depositor2Email}
          onChange={props.onDepositor1Change}
        />
        <MemberPicker
          label="Depositor 2"
          members={props.members}
          selectedEmail={props.depositor2Email}
          disabledEmail={props.depositor1Email}
          onChange={props.onDepositor2Change}
        />
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
