import { useParams, useNavigate } from 'react-router-dom'
import SessionDetailContent from '../components/SessionDetailContent'

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <SessionDetailContent
      sessionId={id!}
      onSelectEnvelope={(eid) => navigate(`/session/${id}/envelope/${eid}`)}
      onNotFound={() => navigate('/')}
    />
  )
}
