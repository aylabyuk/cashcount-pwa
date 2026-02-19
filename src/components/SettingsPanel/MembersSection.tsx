import { useState } from 'react'
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase'
import { useAppSelector } from '../../store'
import Avatar from '../Avatar'
import { useMembers, type Member } from '../../hooks/useMembers'

export default function MembersSection() {
  const unit = useAppSelector((s) => s.auth.unit)
  const authUser = useAppSelector((s) => s.auth.user)
  const currentEmail = authUser?.email ?? ''
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)

  const isAdmin = unit?.role === 'admin'
  const unitId = unit?.unitId ?? null

  const { members } = useMembers(isAdmin ? unitId : null)

  if (!isAdmin || !unitId || !unit) return null

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  async function handleAdd() {
    const email = newEmail.trim().toLowerCase()
    if (!email || !isValidEmail(email)) return
    setLoading(true)
    try {
      await setDoc(doc(db, 'units', unitId!, 'members', email), {
        displayName: newName.trim(),
        role: 'member',
        status: 'active',
        addedAt: serverTimestamp(),
      })
      await setDoc(doc(db, 'userUnits', email), {
        unitId: unitId!,
        unitName: unit!.unitName,
      })
    } catch (err) {
      console.error('Failed to add member:', err)
    } finally {
      setNewEmail('')
      setNewName('')
      setShowAddForm(false)
      setLoading(false)
    }
  }

  async function handleToggleStatus(member: Member) {
    const newStatus = member.status === 'active' ? 'disabled' : 'active'
    setLoading(true)
    try {
      await updateDoc(doc(db, 'units', unitId!, 'members', member.email), {
        status: newStatus,
      })
      if (newStatus === 'disabled') {
        await deleteDoc(doc(db, 'userUnits', member.email))
      } else {
        await setDoc(doc(db, 'userUnits', member.email), {
          unitId: unitId!,
          unitName: unit!.unitName,
        })
      }
    } catch (err) {
      console.error('Failed to update member status:', err)
    } finally {
      setLoading(false)
    }
  }

  const isSelf = (email: string) => email === currentEmail.toLowerCase()
  const canDisable = (member: Member) => !isSelf(member.email)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
          Members
        </h3>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setNewEmail(''); setNewName('') }}
          className="text-xs text-blue-600 dark:text-blue-400 font-medium"
        >
          {showAddForm ? 'Cancel' : 'Add'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-2 space-y-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Display name"
            className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 text-sm px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleAdd}
              disabled={loading || !isValidEmail(newEmail.trim())}
              className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white font-medium disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
        {members.map((member) => (
          <div key={member.email}>
            <button
              onClick={() =>
                setExpandedEmail(expandedEmail === member.email ? null : member.email)
              }
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2 ${
                member.status === 'disabled' ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 text-left min-w-0">
                <Avatar
                  email={member.email}
                  displayName={member.displayName}
                  photoURL={isSelf(member.email) ? authUser?.photoURL : null}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="text-sm truncate">
                    {member.displayName || member.email}
                    {isSelf(member.email) && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">(you)</span>
                    )}
                  </p>
                  {member.displayName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {member.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {member.status === 'disabled' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    disabled
                  </span>
                )}
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                  {member.role}
                </span>
              </div>
            </button>
            {expandedEmail === member.email && canDisable(member) && (
              <div className="px-4 pb-3">
                <button
                  onClick={() => handleToggleStatus(member)}
                  disabled={loading}
                  className={`w-full text-xs py-1.5 rounded-md border disabled:opacity-50 ${
                    member.status === 'active'
                      ? 'border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'border-green-300 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                >
                  {member.status === 'active' ? 'Disable' : 'Enable'}
                </button>
              </div>
            )}
          </div>
        ))}
        {members.length === 0 && (
          <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No members</p>
        )}
      </div>
    </div>
  )
}
