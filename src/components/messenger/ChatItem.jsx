import { formatHistoryDateTime } from '../../utils/dateUtils'
import Avatar from '../ui/Avatar'
import React from 'react'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const ChatItem = ({ chat, isActive, onSelect = () => {} }) => (
  <div 
    className={`chat-item ${isActive ? 'active' : ''}`} 
    key={chat.companion_login}
    onClick={() => onSelect(chat)}
  >
    <Avatar
      avatarUrl={chat.companion_avatar_url}
      size={56}
      alt="Аватар"
      className="chat-avatar"
    />
    <div className="chat-info">
      <div className="chat-login">{chat.title || chat.companion_login}</div>
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
