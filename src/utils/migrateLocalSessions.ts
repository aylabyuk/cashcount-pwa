import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '../firebase'
import type { CountingSession } from '../store/sessionsSlice'

const STORAGE_KEY = 'cashcount_sessions'
const MIGRATED_KEY = 'cashcount_migrated'

export async function migrateLocalSessionsToFirestore(unitId: string): Promise<number> {
  if (localStorage.getItem(MIGRATED_KEY)) return 0

  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    localStorage.setItem(MIGRATED_KEY, 'true')
    return 0
  }

  try {
    const parsed = JSON.parse(data) as { sessions: CountingSession[] }
    const sessions = parsed.sessions ?? []

    if (sessions.length === 0) {
      localStorage.setItem(MIGRATED_KEY, 'true')
      return 0
    }

    await Promise.all(
      sessions.map((session) =>
        setDoc(doc(collection(db, 'units', unitId, 'sessions'), session.id), {
          date: session.date,
          status: session.status ?? 'active',
          envelopes: session.envelopes ?? [],
          reportPrintedAt: session.reportPrintedAt ?? null,
          batchNumber: session.batchNumber ?? null,
          depositedAt: session.depositedAt ?? null,
          depositedBy: session.depositedBy ?? null,
          noDonationsAt: session.noDonationsAt ?? null,
          noDonationsReason: session.noDonationsReason ?? null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      )
    )

    localStorage.setItem(MIGRATED_KEY, 'true')
    localStorage.removeItem(STORAGE_KEY)

    return sessions.length
  } catch (error) {
    console.error('Migration failed:', error)
    return 0
  }
}
