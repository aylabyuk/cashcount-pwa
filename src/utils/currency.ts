const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Format cents (integer) to display string like "$12.50" */
export function formatCurrency(cents: number): string {
  return formatter.format(cents / 100)
}

/** Parse a decimal string (e.g. "12.50") into cents (integer) */
export function parseCents(value: string): number {
  const num = parseFloat(value)
  if (isNaN(num) || num < 0) return 0
  return Math.round(num * 100)
}

/** Format cents as a decimal string for input fields (e.g. 1250 -> "12.50") */
export function centsToDecimalString(cents: number): string {
  if (cents === 0) return ''
  return (cents / 100).toFixed(2)
}
