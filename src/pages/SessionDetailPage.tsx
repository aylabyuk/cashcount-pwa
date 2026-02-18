import { useParams, useNavigate } from 'react-router-dom'
import SessionDetailContent from '../components/SessionDetailContent'

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <SessionDetailContent
      key={id}
      sessionId={id!}
      onNotFound={() => navigate('/')}
    />
  )
}
