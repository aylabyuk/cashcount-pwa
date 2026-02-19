import { useState, useRef, useEffect } from 'react'
import type { Member } from '../../hooks/useMembers'
import Avatar from '../Avatar'

interface Props {
  members: Member[]
  selectedEmail: string
  disabledEmail?: string
  label: string
  onChange: (email: string) => void
}

export default function MemberPicker({ members, selectedEmail, disabledEmail, label, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const selected = members.find((m) => m.email === selectedEmail)
  const available = members.filter((m) => m.email !== disabledEmail)

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selected ? (
          <>
            <Avatar email={selected.email} displayName={selected.displayName} size="sm" />
            <span className="truncate">{selected.displayName || selected.email}</span>
          </>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">Select a member</span>
        )}
        <svg className="w-4 h-4 ml-auto text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
          {available.map((member) => (
            <button
              key={member.email}
              type="button"
              onClick={() => { onChange(member.email); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                member.email === selectedEmail ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <Avatar email={member.email} displayName={member.displayName} size="sm" />
              <div className="min-w-0 text-left">
                <p className="truncate">{member.displayName || member.email}</p>
                {member.displayName && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                )}
              </div>
              {member.email === selectedEmail && (
                <svg className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
          {available.length === 0 && (
            <p className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">No members available</p>
          )}
        </div>
      )}
    </div>
  )
}
