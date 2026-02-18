import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import SessionsListContent from './SessionsListContent'
import SessionDetailContent from './SessionDetailContent'
import EnvelopeFormContent from './EnvelopeFormContent'
import SettingsPanel from './SettingsPanel'

export default function MasterDetailLayout() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const location = useLocation()
  const navigate = useNavigate()

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
    <div className="flex h-full">
      {/* Master panel */}
      <div className="w-90 shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <SessionsListContent
          onSelectSession={(id) => navigate(`/session/${id}`)}
          onSessionDeleted={() => navigate('/', { replace: true })}
          selectedSessionId={selectedSessionId}
          isPanel
        />
        <SettingsPanel />
      </div>

      {/* Detail panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedEnvelopeId && selectedSessionId ? (
          <>
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
          </>
        ) : selectedSessionId ? (
          <SessionDetailContent
            sessionId={selectedSessionId}
            onSelectEnvelope={(eid) =>
              navigate(`/session/${selectedSessionId}/envelope/${eid}`)
            }
            onNotFound={() => navigate('/', { replace: true })}
            isPanel
          />
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
