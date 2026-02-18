import { useTransition, animated } from '@react-spring/web'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useModalKeys } from '../../hooks/useModalKeys'
import { type Envelope } from '../../store/sessionsSlice'
import { SPRING_MODAL } from '../../utils/constants'
import ConfirmDialog from '../ConfirmDialog'
import EnvelopeFormBody from './EnvelopeFormBody'
import EnvelopeSummary from './EnvelopeSummary'
import EnvelopeModalHeader from './EnvelopeModalHeader'
import { useEnvelopeForm } from './useEnvelopeForm'

interface AddProps {
  mode: 'add'
  open: boolean
  onAdd: (envelope: {
    count100: number
    count50: number
    count20: number
    count10: number
    count5: number
    coinsAmount: number
    chequeAmount: number
  }) => void
  onClose: () => void
}

interface EditProps {
  mode: 'edit'
  open: boolean
  sessionId: string
  envelope: Envelope
  displayNumber: number
  disabled?: boolean
  onClose: () => void
}

type Props = AddProps | EditProps

export default function EnvelopeModal(props: Props) {
  const { mode, open } = props
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const form = useEnvelopeForm(props)

  const title = mode === 'edit' ? `Envelope #${props.displayNumber}` : 'New Envelope'

  useModalKeys(open, {
    onClose: form.handleClose,
    onConfirm: mode === 'add' && form.totalCents > 0 && !form.adding
      ? form.handleAdd
      : mode === 'edit' && form.hasChanges && !form.disabled
        ? form.handleSave
        : undefined,
  })

  const transitions = useTransition(open, {
    from: { backdropOpacity: 0, y: isDesktop ? 0 : 100, dialogOpacity: isDesktop ? 0 : 1, scale: isDesktop ? 0.95 : 1 },
    enter: { backdropOpacity: 1, y: 0, dialogOpacity: 1, scale: 1 },
    leave: { backdropOpacity: 0, y: isDesktop ? 0 : 100, dialogOpacity: isDesktop ? 0 : 1, scale: isDesktop ? 0.95 : 1 },
    config: SPRING_MODAL,
  })

  const rendered = transitions((styles, show) =>
    show ? (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <animated.div
          className="fixed inset-0 bg-black/40"
          style={{ opacity: styles.backdropOpacity }}
          onClick={form.handleClose}
        />
        <animated.div
          className="relative bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
          style={{
            opacity: styles.dialogOpacity,
            transform: isDesktop
              ? styles.scale.to((s) => `scale(${s})`)
              : styles.y.to((y) => `translateY(${y}%)`),
          }}
        >
          <EnvelopeModalHeader
            mode={mode}
            title={title}
            disabled={form.disabled}
            hasChanges={form.hasChanges}
            adding={form.adding}
            totalCents={form.totalCents}
            onClose={form.handleClose}
            onAdd={form.handleAdd}
            onSave={form.handleSave}
          />
          <div className="p-4 space-y-4">
            <EnvelopeFormBody
              count100={form.counts.count100} count50={form.counts.count50}
              count20={form.counts.count20} count10={form.counts.count10} count5={form.counts.count5}
              coinsAmount={form.coinsAmount} chequeAmount={form.chequeAmount}
              onCount100Change={form.setters.setCount100} onCount50Change={form.setters.setCount50}
              onCount20Change={form.setters.setCount20} onCount10Change={form.setters.setCount10}
              onCount5Change={form.setters.setCount5}
              onCoinsChange={form.setCoinsAmount} onChequeChange={form.setChequeAmount}
              disabled={form.disabled}
            />
            <EnvelopeSummary
              cashTotal={form.cashTotalCents}
              coinsAmount={form.coinsAmount}
              chequeAmount={form.chequeAmount}
              total={form.totalCents}
            />
          </div>
        </animated.div>
      </div>
    ) : null
  )

  const discardMessage = mode === 'add'
    ? 'You have unsaved data. Are you sure you want to discard this envelope?'
    : 'You have unsaved changes. Are you sure you want to discard them?'

  return (
    <>
      {rendered}
      <ConfirmDialog
        open={form.showDiscardConfirm}
        title={mode === 'add' ? 'Discard Envelope?' : 'Discard Changes?'}
        message={discardMessage}
        confirmLabel="Discard"
        onConfirm={form.handleConfirmDiscard}
        onCancel={() => form.setShowDiscardConfirm(false)}
      />
    </>
  )
}
