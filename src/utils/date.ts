/** Get the most recent Sunday (or today if Sunday) as YYYY-MM-DD */
export function getCurrentSunday(): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayOfWeek = today.getDay() // 0 = Sunday
  const diff = dayOfWeek // days since Sunday
  today.setDate(today.getDate() - diff)
  return toDateString(today)
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
