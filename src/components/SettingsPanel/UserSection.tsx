import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useAppSelector } from '../../store'

export default function UserSection() {
  const user = useAppSelector((s) => s.auth.user)
  const unit = useAppSelector((s) => s.auth.unit)

  if (!user) return null

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
        Account
      </h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="w-10 h-10 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                {(user.displayName?.[0] ?? user.email[0]).toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            {user.displayName && (
              <p className="text-sm font-medium truncate">{user.displayName}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        {unit && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Unit: <span className="font-medium">{unit.unitName}</span>
          </p>
        )}
        <button
          onClick={() => signOut(auth)}
          className="w-full py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
