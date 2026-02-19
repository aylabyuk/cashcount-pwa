import type { CountingSession } from '../store/sessionsSlice'

/** Collect unique participant emails from a session's tracking fields */
export function getSessionParticipants(session: CountingSession): string[] {
  const emails = new Set<string>()

  if (session.createdBy) emails.add(session.createdBy)
  if (session.lastUpdatedBy) emails.add(session.lastUpdatedBy)
  if (session.reportPrintedBy) emails.add(session.reportPrintedBy)

  for (const envelope of session.envelopes) {
    if (envelope.lastUpdatedBy) emails.add(envelope.lastUpdatedBy)
  }

  return Array.from(emails)
}
