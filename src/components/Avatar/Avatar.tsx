import { useState } from 'react'

const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function getInitials(displayName: string | null | undefined, email: string): string {
  if (displayName) {
    const parts = displayName.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0][0].toUpperCase()
  }
  return email[0].toUpperCase()
}

interface Props {
  email: string
  photoURL?: string | null
  displayName?: string | null
  size?: 'sm' | 'md'
}

export default function Avatar({ email, photoURL, displayName, size = 'sm' }: Props) {
  const [imgError, setImgError] = useState(false)
  const initials = getInitials(displayName, email)
  const colorClass = COLORS[hashString(email) % COLORS.length]

  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={displayName || email}
        onError={() => setImgError(true)}
        className={`${sizeClasses} rounded-full object-cover ring-2 ring-white dark:ring-gray-800`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses} ${colorClass} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-gray-800`}
      title={displayName || email}
    >
      {initials}
    </div>
  )
}
