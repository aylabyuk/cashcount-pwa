import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import SessionsListPage from './pages/SessionsListPage'
import SessionDetailPage from './pages/SessionDetailPage'
import EnvelopeFormPage from './pages/EnvelopeFormPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<SessionsListPage />} />
          <Route path="/session/:id" element={<SessionDetailPage />} />
          <Route path="/session/:id/envelope/:envelopeId" element={<EnvelopeFormPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
