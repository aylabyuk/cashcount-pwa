import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export interface Member {
  email: string
  displayName: string
  role: string       // 'admin' | 'member'
  status: string     // 'active' | 'disabled'
}

export function useMembers(unitId: string | null) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!unitId) {
      setMembers([])
      setLoading(false)
      return
    }

    setLoading(true)
    const membersRef = collection(db, 'units', unitId, 'members')
    const unsub = onSnapshot(membersRef, (snapshot) => {
      const list: Member[] = snapshot.docs.map((d) => ({
        email: d.id,
        displayName: d.data().displayName ?? '',
        role: d.data().role ?? 'member',
        status: d.data().status ?? 'active',
      }))
      list.sort((a, b) => {
        if (a.status !== b.status) return a.status === 'active' ? -1 : 1
        return a.email.localeCompare(b.email)
      })
      setMembers(list)
      setLoading(false)
    })

    return unsub
  }, [unitId])

  const activeMembers = members.filter((m) => m.status === 'active')

  return { members, activeMembers, loading }
}
