import { formatHistoryDateTime } from '../../utils/dateUtils'
import React from 'react'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const ChatHistory = ({ messages }) => (
  <div>
    {messages.map(msg => (
      <div key={msg.id}>
        <span>{formatHistoryDateTime(msg.time, userTimezone)}</span>
      </div>
    ))}
  </div>
)

export default ChatHistory
