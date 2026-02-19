import { onDocumentUpdated } from 'firebase-functions/v2/firestore'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'

initializeApp()

const db = getFirestore()

interface NotificationConfig {
  title: string
  body: (actorName: string, sessionDate: string) => string
  getTargetEmails: (depositInfo: Record<string, string>, initiatedBy: string, actorEmail: string) => Set<string>
}

const STATUS_NOTIFICATIONS: Record<string, NotificationConfig> = {
  pending_deposit: {
    title: 'Deposit Verification Needed',
    body: (actor, date) => `${actor} initiated a deposit for the ${date} session`,
    getTargetEmails: (depositInfo, _initiatedBy, actorEmail) => {
      // Notify P2 (depositor2) + admins, exclude initiator
      const emails = new Set<string>()
      emails.add(depositInfo.depositor2)
      emails.delete(actorEmail)
      return emails
    },
  },
  deposited: {
    title: 'Deposit Verified',
    body: (actor, date) => `${actor} verified the deposit for the ${date} session`,
    getTargetEmails: (depositInfo, _initiatedBy, actorEmail) => {
      // Notify both depositors + admins, exclude verifier
      const emails = new Set<string>()
      emails.add(depositInfo.depositor1)
      emails.add(depositInfo.depositor2)
      emails.delete(actorEmail)
      return emails
    },
  },
  recorded: {
    title: 'Deposit Rejected',
    body: (actor, date) => `${actor} rejected the deposit for the ${date} session`,
    getTargetEmails: (depositInfo, initiatedBy, actorEmail) => {
      // Notify the person who initiated the deposit + admins, exclude rejector
      const emails = new Set<string>()
      emails.add(initiatedBy)
      emails.add(depositInfo.depositor1)
      emails.add(depositInfo.depositor2)
      emails.delete(actorEmail)
      return emails
    },
  },
}

/**
 * Send push notifications on deposit-related status changes:
 * - pending_deposit: notify P2 + admins to verify
 * - deposited: notify depositors that it was verified
 * - recorded (from pending_deposit): notify initiator that it was rejected
 */
export const onDepositStatusChange = onDocumentUpdated(
  'units/{unitId}/sessions/{sessionId}',
  async (event) => {
    const before = event.data?.before.data()
    const after = event.data?.after.data()
    if (!before || !after) return

    const beforeStatus = before.status as string
    const afterStatus = after.status as string
    console.log(`Status change: ${beforeStatus} -> ${afterStatus}`)

    // Only handle deposit-related transitions
    const isDepositInitiated = beforeStatus !== 'pending_deposit' && afterStatus === 'pending_deposit'
    const isDepositVerified = beforeStatus === 'pending_deposit' && afterStatus === 'deposited'
    const isDepositRejected = beforeStatus === 'pending_deposit' && afterStatus === 'recorded'

    if (!isDepositInitiated && !isDepositVerified && !isDepositRejected) {
      console.log('Not a deposit-related transition, skipping')
      return
    }

    // For verified/rejected, use the before data's depositInfo (it may be cleared on reject)
    const depositInfo = afterStatus === 'recorded'
      ? before.depositInfo
      : after.depositInfo
    if (!depositInfo) {
      console.log('No depositInfo found')
      return
    }

    console.log('depositInfo:', JSON.stringify(depositInfo))

    const config = STATUS_NOTIFICATIONS[afterStatus]
    if (!config) return

    const unitId = event.params.unitId
    const sessionId = event.params.sessionId

    // Determine who performed the action
    let actorEmail: string
    if (isDepositInitiated) {
      actorEmail = depositInfo.initiatedBy
    } else if (isDepositVerified) {
      actorEmail = after.depositInfo?.verifiedBy || ''
    } else {
      // Rejected — use lastUpdatedBy from the Firestore doc
      actorEmail = (after.lastUpdatedBy as string) || ''
    }

    // Build target email list from config
    const notifyEmails = config.getTargetEmails(depositInfo, depositInfo.initiatedBy, actorEmail)

    // Also add all unit admins
    const membersSnap = await db.collection(`units/${unitId}/members`).get()
    for (const memberDoc of membersSnap.docs) {
      const data = memberDoc.data()
      if (data.role === 'admin' && data.status === 'active') {
        notifyEmails.add(memberDoc.id)
      }
    }

    // Don't notify the actor
    if (actorEmail) {
      notifyEmails.delete(actorEmail)
    }

    console.log('Emails to notify:', [...notifyEmails])

    if (notifyEmails.size === 0) {
      console.log('No one to notify')
      return
    }

    // Get FCM tokens for target users
    const tokensSnap = await db.collection(`units/${unitId}/fcmTokens`).get()
    console.log(`Found ${tokensSnap.size} FCM tokens in unit`)
    const tokens: string[] = []
    for (const tokenDoc of tokensSnap.docs) {
      const data = tokenDoc.data()
      if (notifyEmails.has(data.email)) {
        tokens.push(data.token)
      }
    }

    if (tokens.length === 0) {
      console.log('No FCM tokens found for target users')
      return
    }

    // Look up actor name for notification text
    let actorName = actorEmail
    if (actorEmail) {
      const actorDoc = await db.doc(`units/${unitId}/members/${actorEmail}`).get()
      if (actorDoc.exists) {
        actorName = actorDoc.data()?.displayName || actorEmail
      }
    }

    const sessionDate = (after.date || before.date || 'Unknown date') as string

    const message = {
      tokens,
      data: {
        title: config.title,
        body: config.body(actorName, sessionDate),
        sessionId,
        url: `/session/${sessionId}`,
      },
    }

    console.log(`Sending to ${tokens.length} tokens`)
    const response = await getMessaging().sendEachForMulticast(message)
    console.log(`Success: ${response.successCount}, Failures: ${response.failureCount}`)

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
