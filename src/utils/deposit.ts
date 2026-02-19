import type { CountingSession } from '../store/sessionsSlice'
import type { Member } from '../hooks/useMembers'

export interface DepositorDisplay {
  depositor1Name: string
  depositor2Name: string
  verifiedByName?: string
}

/** Resolve depositor emails to display names using the members map. */
export function resolveDepositorNames(
  session: CountingSession,
  membersMap: Map<string, Member>,
): DepositorDisplay | null {
  if (!session.depositInfo) return null
  const lookup = (email: string) =>
    membersMap.get(email)?.displayName || email
  return {
    depositor1Name: lookup(session.depositInfo.depositor1),
    depositor2Name: lookup(session.depositInfo.depositor2),
    verifiedByName: session.depositInfo.verifiedBy
      ? lookup(session.depositInfo.verifiedBy)
      : undefined,
  }
}

/**
 * Check if the current user can verify or reject a pending deposit.
 * P2 or any admin can verify/reject.
 */
export function canVerifyDeposit(
  session: CountingSession,
  userEmail: string,
  userRole: string,
): boolean {
  if (session.status !== 'pending_deposit' || !session.depositInfo) return false
  const isP2 = session.depositInfo.depositor2 === userEmail
  const isAdmin = userRole === 'admin'
  return isP2 || isAdmin
}
