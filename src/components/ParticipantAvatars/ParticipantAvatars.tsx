import Avatar from '../Avatar'

const MAX_VISIBLE = 3

export interface ParticipantInfo {
  displayName?: string | null
  photoURL?: string | null
}

interface Props {
  emails: string[]
  members?: Map<string, ParticipantInfo>
}

export default function ParticipantAvatars({ emails, members }: Props) {
  if (emails.length === 0) return null

  const visible = emails.slice(0, MAX_VISIBLE)
  const extra = emails.length - MAX_VISIBLE

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((email) => {
        const info = members?.get(email)
        return (
          <Avatar
            key={email}
            email={email}
            displayName={info?.displayName}
            photoURL={info?.photoURL}
          />
        )
      })}
      {extra > 0 && (
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-[10px] font-semibold text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
          +{extra}
        </div>
      )}
    </div>
  )
}
