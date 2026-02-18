import { useAuthListener } from './hooks/useAuthListener'
import { useFirestoreSync } from './hooks/useFirestoreSync'
import AuthGate from './components/AuthGate/AuthGate'
import Layout from './components/Layout'

export default function App() {
  useAuthListener()
  useFirestoreSync()

  return (
    <AuthGate>
      <Layout />
    </AuthGate>
  )
}
