import { formatHistoryDateTime } from '../../utils/dateUtils'
import React from 'react'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const defaultAvatar = (
  <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#e0e0e0"/>
    <path d="M32 34c6.627 0 12-5.373 12-12S38.627 10 32 10 20 15.373 20 22s5.373 12 12 12zm0 4c-8.837 0-16 4.03-16 9v3h32v-3c0-4.97-7.163-9-16-9z" fill="#bdbdbd"/>
  </svg>
)

const ChatItem = ({ chat, isActive, onSelect = () => {} }) => (
  <div 
    className={`chat-item ${isActive ? 'active' : ''}`} 
    key={chat.companion_login}
    onClick={() => onSelect(chat)}
  >
    {chat.companion_avatar_url
      ? <img
          src={chat.companion_avatar_url}
          alt="Аватар"
          className="chat-avatar"
          width={56}
          height={56}
        />
      : defaultAvatar
    }
    <div className="chat-info">
      <div className="chat-login">{chat.companion_login}</div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div className="chat-message" style={{flex: 1}}>{chat.last_message}</div>
        <div className="chat-time" style={{marginLeft: 12, whiteSpace: 'nowrap', fontSize: 13, color: 'rgba(255,255,255,0.5)'}}>
          {formatHistoryDateTime(chat.last_message_time, userTimezone).split(',')[1]?.trim()}
        </div>
      </div>
    </div>
  </div>
)

export default ChatItem
