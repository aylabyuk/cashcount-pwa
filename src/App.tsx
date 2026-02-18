import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import MasterDetailLayout from './components/MasterDetailLayout'
import SessionsListPage from './pages/SessionsListPage'
import SessionDetailPage from './pages/SessionDetailPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<MasterDetailLayout />}>
            <Route path="/" element={<SessionsListPage />} />
            <Route path="/session/:id" element={<SessionDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
