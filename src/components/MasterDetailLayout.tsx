import { useState } from 'react'
import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom'
import { useSpring, animated } from '@react-spring/web'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { SPRING_MODAL, DESKTOP_BREAKPOINT } from '../utils/constants'
import SessionsListContent from './SessionsListContent'
import SessionDetailContent from './SessionDetailContent'
import SettingsPanel from './SettingsPanel'

const PANEL_WIDTH = 360

export default function MasterDetailLayout() {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const springStyles = useSpring({
    width: collapsed ? 0 : PANEL_WIDTH,
    opacity: collapsed ? 0 : 1,
    config: SPRING_MODAL,
  })

  // Mobile: render the matched route as a full page
  if (!isDesktop) {
    return <Outlet />
  }

  // Desktop: parse URL to determine right panel content
  const sessionMatch = matchPath('/session/:id', location.pathname)
  const selectedSessionId = sessionMatch?.params.id ?? null

  return (
    <div className="relative h-full">
      {/* Master panel - overlays detail */}
      <animated.div
        style={{ width: springStyles.width, opacity: springStyles.opacity, overflow: 'hidden' }}
        className="absolute left-0 top-0 bottom-0 z-10 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col"
      >
        <div className="flex flex-col h-full" style={{ width: PANEL_WIDTH }}>
          <SessionsListContent
            onSelectSession={(id) => navigate(`/session/${id}`)}
            onSessionDeleted={() => navigate('/', { replace: true })}
            selectedSessionId={selectedSessionId}
            isPanel
          />
          <SettingsPanel />
        </div>
      </animated.div>

      {/* Collapse toggle */}
      <animated.button
        onClick={() => setCollapsed(!collapsed)}
        style={{ left: springStyles.width }}
        className="absolute top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-md p-1.5 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </animated.button>

      {/* Detail panel - always full width */}
      <div className="h-full flex flex-col overflow-hidden">
        {selectedSessionId ? (
          <div className="flex-1 overflow-hidden w-full max-w-3xl mx-auto">
            <SessionDetailContent
              key={selectedSessionId}
              sessionId={selectedSessionId}
              onNotFound={() => navigate('/', { replace: true })}
              isPanel
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">Select a Session</p>
            <p className="text-sm">Choose a session from the list to view details.</p>
          </div>
        )}
      </div>
    </div>
  )
}
