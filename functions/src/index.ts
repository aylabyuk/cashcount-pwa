import { onDocumentUpdated } from 'firebase-functions/v2/firestore'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'

initializeApp()

const db = getFirestore()

/**
 * When a session status changes to 'pending_deposit', send push notifications
 * to P2 (depositor2) and all unit admins so they can verify or reject the deposit.
 */
export const onDepositInitiated = onDocumentUpdated(
  'units/{unitId}/sessions/{sessionId}',
  async (event) => {
    const before = event.data?.before.data()
    const after = event.data?.after.data()
    if (!before || !after) return

    // Only trigger when status transitions to pending_deposit
    if (before.status === 'pending_deposit' || after.status !== 'pending_deposit') return

    const unitId = event.params.unitId
    const sessionId = event.params.sessionId
    const depositInfo = after.depositInfo
    if (!depositInfo) return

    // Collect emails that should be notified: P2 + all admins
    const notifyEmails = new Set<string>()
    notifyEmails.add(depositInfo.depositor2)

    // Find all admins in the unit
    const membersSnap = await db.collection(`units/${unitId}/members`).get()
    for (const memberDoc of membersSnap.docs) {
      const data = memberDoc.data()
      if (data.role === 'admin' && data.status === 'active') {
        notifyEmails.add(memberDoc.id) // doc ID is email
      }
    }

    // Don't notify the person who initiated the deposit
    notifyEmails.delete(depositInfo.initiatedBy)

    if (notifyEmails.size === 0) return

    // Get FCM tokens for all target users
    const tokensSnap = await db.collection(`units/${unitId}/fcmTokens`).get()
    const tokens: string[] = []
    for (const tokenDoc of tokensSnap.docs) {
      const data = tokenDoc.data()
      if (notifyEmails.has(data.email)) {
        tokens.push(data.token)
      }
    }

    if (tokens.length === 0) return

    // Look up initiator name for notification text
    let initiatorName = depositInfo.initiatedBy
    const initiatorDoc = await db.doc(`units/${unitId}/members/${depositInfo.initiatedBy}`).get()
    if (initiatorDoc.exists) {
      initiatorName = initiatorDoc.data()?.displayName || initiatorName
    }

    const sessionDate = after.date || 'Unknown date'

    const message = {
      tokens,
      data: {
        title: 'Deposit Verification Needed',
        body: `${initiatorName} initiated a deposit for the ${sessionDate} session`,
        sessionId,
        url: `/session/${sessionId}`,
      },
    }

    const response = await getMessaging().sendEachForMulticast(message)

    // Clean up invalid tokens
    const failedTokens: string[] = []
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const errorCode = resp.error?.code
        if (
          errorCode === 'messaging/invalid-registration-token' ||
          errorCode === 'messaging/registration-token-not-registered'
        ) {
          failedTokens.push(tokens[idx])
        }
      }
    })

    if (failedTokens.length > 0) {
      const batch = db.batch()
      for (const token of failedTokens) {
        batch.delete(db.doc(`units/${unitId}/fcmTokens/${token}`))
      }
      await batch.commit()
    }
  }
)
