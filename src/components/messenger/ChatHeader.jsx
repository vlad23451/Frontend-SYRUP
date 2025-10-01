import React, { useState } from 'react'
import Avatar from '../ui/Avatar'
import SearchModal from '../search/SearchModal'

const ChatHeader = ({ selectedChat }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  if (!selectedChat) {
    return (
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-user-avatar">C</div>
        <div>
          <div className="chat-user-name">Выберите чат</div>
        </div>
        </div>
        <div className="chat-header-actions">
          <button 
            className="chat-action-btn"
            onClick={() => setIsSearchOpen(true)}
            title="Поиск"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-header">
      <div className="chat-user-info">
        <Avatar
          avatarUrl={selectedChat.companion_avatar_url}
          size={40}
          alt="Аватар"
          className="chat-user-avatar"
        />
        <div>
          <div className="chat-user-name">{selectedChat.title || selectedChat.companion_login}</div>
        </div>
      </div>
      <div className="chat-header-actions">
        <button 
          className="chat-action-btn"
          onClick={() => setIsSearchOpen(true)}
          title="Поиск"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <button 
          className="chat-action-btn"
          onClick={() => {/* TODO: открыть модал с закрепленными сообщениями */}}
          title="Закрепленные сообщения"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 17v5"/>
            <path d="M5 7l5 5v4l4-4 5-5z"/>
          </svg>
        </button>
      </div>
      
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentChatId={selectedChat.id}
      />
    </div>
  )
}

export default ChatHeader
