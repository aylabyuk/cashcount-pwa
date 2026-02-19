import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useAppSelector } from '../../store'

export default function UserSection() {
  const user = useAppSelector((s) => s.auth.user)
  const unit = useAppSelector((s) => s.auth.unit)
  const [showSignOut, setShowSignOut] = useState(false)

  if (!user) return null

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
        Account
      </h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
        <button
          onClick={() => setShowSignOut(!showSignOut)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="w-8 h-8 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">
                {(user.displayName?.[0] ?? user.email[0]).toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1 text-left">
            {user.displayName && (
              <p className="text-sm font-medium truncate">{user.displayName}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
          {unit && (
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400 dark:text-gray-500">{unit.unitName}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{unit.role}</p>
            </div>
          )}
        </button>
        {showSignOut && (
          <button
            onClick={() => signOut(auth)}
            className="w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-black/2 dark:hover:bg-white/2 text-left"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  )
}
