// Bill denominations (highest to lowest)
export const BILL_DENOMINATIONS = [100, 50, 20, 10, 5] as const

// react-spring animation configs
export const SPRING_MODAL = { tension: 300, friction: 30 }
export const SPRING_SNAPPY = { tension: 300, friction: 24 }

// Modal dialog transition presets (scale from 0.95)
export const MODAL_TRANSITION = {
  from: { backdropOpacity: 0, scale: 0.95, dialogOpacity: 0 },
  enter: { backdropOpacity: 1, scale: 1, dialogOpacity: 1 },
  leave: { backdropOpacity: 0, scale: 0.95, dialogOpacity: 0 },
  config: SPRING_MODAL,
}

// Layout breakpoints (media query strings)
export const DESKTOP_BREAKPOINT = '(min-width: 768px)'

// Input validation
export const CURRENCY_REGEX = /^\d*\.?\d{0,2}$/

// Data retention
export const PURGE_MONTHS = 6

// Session status badges
export const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  recorded: {
    label: 'Recorded',
    className: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
  },
  deposited: {
    label: 'Deposited',
    className: 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  },
  no_donations: {
    label: 'No Donations',
    className: 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
  },
}
