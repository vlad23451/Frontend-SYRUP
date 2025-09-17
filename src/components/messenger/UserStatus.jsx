import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../stores/StoreContext'
import { formatLastSeenTime } from '../../utils/dateUtils'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const UserStatus = observer(({ userId }) => {
  const { userStatus } = useStore()
  
  if (!userId) {
    return <div className="chat-user-status">-</div>
  }

  const status = userStatus.getUserStatus(userId)
  const isOnline = status.is_online
  const lastSeen = status.last_seen

  if (isOnline) {
    return (
      <div className="chat-user-status online">
        в сети
      </div>
    )
  }

  const lastSeenText = formatLastSeenTime(lastSeen, userTimezone)
  
  return (
    <div className="chat-user-status offline">
      был(а) {lastSeenText}
    </div>
  )
})

export default UserStatus
