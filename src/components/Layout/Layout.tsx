import { useEffect, useState, useCallback } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store'
import { purgeOldSessions } from '../../store/sessionsSlice'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { DESKTOP_BREAKPOINT, PURGE_MONTHS } from '../../utils/constants'
import Toast from '../Toast'
import appIcon from '../../assets/icon.png'

export default function Layout() {
  const theme = useAppSelector((s) => s.settings.theme)
  const sessions = useAppSelector((s) => s.sessions.sessions)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  const [toastMessage, setToastMessage] = useState('')
  const handleToastClose = useCallback(() => setToastMessage(''), [])

  // Purge sessions older than 6 months on first load
  useEffect(() => {
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - PURGE_MONTHS)
    const cutoffStr = cutoff.toISOString().slice(0, 10)
    const oldCount = sessions.filter((s) => s.date < cutoffStr).length
    if (oldCount > 0) {
      dispatch(purgeOldSessions())
      setToastMessage(
        `${oldCount} session${oldCount > 1 ? 's' : ''} older than ${PURGE_MONTHS} months removed`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isHome = location.pathname === '/'

  // On desktop, all routes show the title (list panel is visible); gear only on mobile home
  const showTitle = isDesktop || isHome
  const showGear = !isDesktop && isHome
  const showBack = isDesktop ? false : !isHome

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [theme])

  // Listen for system theme changes when set to "system"
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  // On desktop with master-detail, use h-screen flex layout for panel heights
  const isMasterDetail = isDesktop

  return (
    <div className={`${isMasterDetail ? 'h-screen overflow-hidden' : 'min-h-screen'} flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className={`${isMasterDetail ? 'px-6' : 'max-w-2xl mx-auto px-4'} h-14 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {showTitle && (
              <div className="flex items-center gap-1.5">
                <img src={appIcon} alt="" className="w-7 h-7" />
                <h1 className="text-lg font-semibold">CashCount</h1>
              </div>
            )}
          </div>
          {showGear && (
            <button
              onClick={() => navigate('/settings')}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
      </header>
      <main className={isMasterDetail ? 'flex-1 overflow-hidden' : 'max-w-2xl mx-auto w-full'}>
        <Outlet />
      </main>
      <Toast open={!!toastMessage} message={toastMessage} onClose={handleToastClose} />
    </div>
  )
}
