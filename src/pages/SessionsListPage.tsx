import { useNavigate } from 'react-router-dom'
import SessionsListContent from '../components/SessionsListContent'

export default function SessionsListPage() {
  const navigate = useNavigate()

  return (
    <SessionsListContent
      onSelectSession={(id) => navigate(`/session/${id}`)}
    />
  )
}
