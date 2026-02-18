import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useAppSelector } from '../../store'
import appIcon from '../../assets/icon.png'

export default function NoUnitScreen() {
  const user = useAppSelector((s) => s.auth.user)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <img src={appIcon} alt="" className="w-16 h-16 mb-6" />
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center max-w-xs">
        The account <span className="font-medium">{user?.email}</span> is not a member of any unit.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center max-w-xs">
        Contact your unit administrator to be added.
      </p>
      <button
        onClick={() => signOut(auth)}
        className="px-6 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
      >
        Sign out and try another account
      </button>
    </div>
  )
}
