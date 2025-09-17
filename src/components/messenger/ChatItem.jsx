import { formatChatSidebarTime } from '../../utils/dateUtils'
import Avatar from '../ui/Avatar'
import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../stores/StoreContext'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const ChatItem = observer(({ chat, isActive, onSelect = () => {} }) => {
  const { chat: chatStore } = useStore()
  
  const chatId = chat.chat_id || chat.companion_id || chat.companionId || chat.id
  const unreadCount = chatStore.getUnreadCount(chatId) || chat.unread_count || 0
  
  return (
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
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            {unreadCount > 0 && (
              <div className="unread-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
            <div className="chat-time" style={{whiteSpace: 'nowrap', fontSize: 13, color: 'rgba(255,255,255,0.5)'}}>
              {formatChatSidebarTime(chat.last_message_time, userTimezone)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ChatItem
