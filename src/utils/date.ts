/** Get the most recent Sunday (or today if Sunday) as YYYY-MM-DD */
export function getCurrentSunday(): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayOfWeek = today.getDay() // 0 = Sunday
  const diff = dayOfWeek // days since Sunday
  today.setDate(today.getDate() - diff)
  return toDateString(today)
}

/** Check if a session dated on `dateStr` (a Sunday) is locked.
 *  A session locks after the following Sunday has passed. */
export function isSessionLocked(dateStr: string): boolean {
  const sessionDate = new Date(dateStr + 'T00:00:00')
  const nextSunday = new Date(sessionDate)
  nextSunday.setDate(nextSunday.getDate() + 7)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now >= nextSunday
}

/** Format a YYYY-MM-DD date string for display (e.g. "Feb 16, 2026") */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
