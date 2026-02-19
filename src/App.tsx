import { useAuthListener } from './hooks/useAuthListener'
import { useFirestoreSync } from './hooks/useFirestoreSync'
import { useDeepLink } from './hooks/useDeepLink'
import AuthGate from './components/AuthGate/AuthGate'
import Layout from './components/Layout'
import OfflineBanner from './components/OfflineBanner'

export default function App() {
  useAuthListener()
  useFirestoreSync()
  useDeepLink()

  return (
    <>
      <OfflineBanner />
      <AuthGate>
        <Layout />
      </AuthGate>
    </>
  )
}
