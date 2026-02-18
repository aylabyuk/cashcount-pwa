import { useState } from 'react'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from '../../firebase'
import { useAppSelector } from '../../store'
import appIcon from '../../assets/icon.png'

export default function SignInScreen() {
  const [signingIn, setSigningIn] = useState(false)
  const error = useAppSelector((s) => s.auth.error)

  async function handleSignIn() {
    setSigningIn(true)
    try {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      if (isStandalone) {
        await signInWithRedirect(auth, googleProvider)
      } else {
        await signInWithPopup(auth, googleProvider)
      }
    } catch (err) {
      console.error('Sign-in error:', err)
      setSigningIn(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <img src={appIcon} alt="" className="w-20 h-20 mb-6" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">CashCount</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
        Sign in to access your unit's counting sessions.
      </p>
      <button
        onClick={handleSignIn}
        disabled={signingIn}
        className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {signingIn ? 'Signing in...' : 'Sign in with Google'}
        </span>
      </button>
      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
