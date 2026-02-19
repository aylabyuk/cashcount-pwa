import { useMemo } from 'react'
import { useAppSelector } from '../../store'
import { getCurrentSunday } from '../../utils/date'
import { STATUS_BADGE } from '../../utils/constants'
import { canVerifyDeposit } from '../../utils/deposit'

export function useSessionDetail(sessionId: string) {
  const session = useAppSelector((s) =>
    s.sessions.sessions.find((s) => s.id === sessionId)
  )
  const userEmail = useAppSelector((s) => s.auth.user?.email ?? '')
  const userRole = useAppSelector((s) => s.auth.unit?.role ?? 'member')

  const status = session?.status ?? 'active'
  const editable = status === 'active'
  const badge = STATUS_BADGE[status]
  const canReactivate =
    status === 'no_donations' && session?.date === getCurrentSunday()
  const canVerify = session ? canVerifyDeposit(session, userEmail, userRole) : false

  const sortedEnvelopes = useMemo(
    () => (session ? [...session.envelopes].sort((a, b) => a.number - b.number) : []),
    [session?.envelopes]
  )

  const displayIndex = useMemo(
    () => new Map(sortedEnvelopes.map((e, i) => [e.id, i + 1])),
    [sortedEnvelopes]
  )

  return {
    session,
    status,
    editable,
    badge,
    canReactivate,
    canVerify,
    sortedEnvelopes,
    displayIndex,
  }
}
