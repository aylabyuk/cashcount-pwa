import { useState } from 'react'
import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom'
import { useSpring, animated } from '@react-spring/web'
import { useMediaQuery } from '../hooks/useMediaQuery'
import SessionsListContent from './SessionsListContent'
import SessionDetailContent from './SessionDetailContent'
import EnvelopeFormContent from './EnvelopeFormContent'
import SettingsPanel from './SettingsPanel'

const PANEL_WIDTH = 360

export default function MasterDetailLayout() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const springStyles = useSpring({
    width: collapsed ? 0 : PANEL_WIDTH,
    opacity: collapsed ? 0 : 1,
    config: { tension: 300, friction: 30 },
  })

  // Mobile: render the matched route as a full page
  if (!isDesktop) {
    return <Outlet />
  }

  // Desktop: parse URL to determine right panel content
  const envelopeMatch = matchPath(
    '/session/:id/envelope/:envelopeId',
    location.pathname
  )
  const sessionMatch = matchPath('/session/:id', location.pathname)

  const selectedSessionId =
    envelopeMatch?.params.id ?? sessionMatch?.params.id ?? null
  const selectedEnvelopeId = envelopeMatch?.params.envelopeId ?? null

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
        {selectedEnvelopeId && selectedSessionId ? (
          <div className="flex-1 flex flex-col overflow-hidden w-full max-w-3xl mx-auto">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <button
                onClick={() => navigate(`/session/${selectedSessionId}`)}
                className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to session
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EnvelopeFormContent
                sessionId={selectedSessionId}
                envelopeId={selectedEnvelopeId}
                onNotFound={() => navigate('/', { replace: true })}
              />
            </div>
          </div>
        ) : selectedSessionId ? (
          <div className="flex-1 overflow-hidden w-full max-w-3xl mx-auto">
            <SessionDetailContent
              sessionId={selectedSessionId}
              onSelectEnvelope={(eid) =>
                navigate(`/session/${selectedSessionId}/envelope/${eid}`)
              }
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
