import { useParams, useNavigate } from 'react-router-dom'
import EnvelopeFormContent from '../components/EnvelopeFormContent'

export default function EnvelopeFormPage() {
  const { id: sessionId, envelopeId } = useParams<{ id: string; envelopeId: string }>()
  const navigate = useNavigate()

  return (
    <EnvelopeFormContent
      sessionId={sessionId!}
      envelopeId={envelopeId!}
      onNotFound={() => navigate(-1)}
    />
  )
}
