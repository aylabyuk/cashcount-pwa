import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useThemeSync } from '../../hooks/useThemeSync'
import { usePurgeOldSessions } from '../../hooks/usePurgeOldSessions'
import { useAppSelector, useAppDispatch } from '../../store'
import { navigateToList, navigateToDetail, navigateToSettings } from '../../store/viewSlice'
import { DESKTOP_BREAKPOINT } from '../../utils/constants'
import Toast from '../Toast'
import MasterDetailLayout from '../MasterDetailLayout'
import SessionsListContent from '../SessionsListContent'
import SessionDetailContent from '../SessionDetailContent'
import MobileSettingsView from '../SettingsPanel/MobileSettingsView'
import appIcon from '../../assets/icon.png'

export default function Layout() {
  const dispatch = useAppDispatch()
  const view = useAppSelector((s) => s.view)
  const unitName = useAppSelector((s) => s.auth.unit?.unitName ?? null)
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  useThemeSync()
  const { toastMessage, handleToastClose } = usePurgeOldSessions()

  const isHome = view.current === 'list'
  const showTitle = isDesktop || isHome
  const showGear = !isDesktop && isHome
  const showBack = !isDesktop && !isHome

  return (
    <div className={`${isDesktop ? 'h-screen overflow-hidden' : 'min-h-screen pb-[env(safe-area-inset-bottom)]'} flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className={`${isDesktop ? 'px-6' : 'max-w-2xl mx-auto px-4'} h-14 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {showBack && (
              <>
                <button
                  onClick={() => dispatch(navigateToList())}
                  className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {unitName && (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{unitName}</span>
                )}
              </>
            )}
            {showTitle && (
              <div className="flex items-center gap-1.5">
                <img src={appIcon} alt="" className="w-9 h-9 rounded-lg" />
                <div>
                  <h1 className="text-lg font-semibold leading-tight">CashCount</h1>
                  {unitName && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">{unitName}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          {showGear && (
            <button
              onClick={() => dispatch(navigateToSettings())}
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
      <main className={isDesktop ? 'flex-1 overflow-hidden' : 'max-w-2xl mx-auto w-full'}>
        {isDesktop ? (
          <MasterDetailLayout />
        ) : (
          <>
            {view.current === 'list' && (
              <SessionsListContent onSelectSession={(id) => dispatch(navigateToDetail(id))} />
            )}
            {view.current === 'detail' && view.selectedSessionId && (
              <SessionDetailContent
                key={view.selectedSessionId}
                sessionId={view.selectedSessionId}
                onNotFound={() => dispatch(navigateToList())}
              />
            )}
            {view.current === 'settings' && <MobileSettingsView />}
          </>
        )}
      </main>
      <Toast open={!!toastMessage} message={toastMessage} onClose={handleToastClose} />
    </div>
  )
}
