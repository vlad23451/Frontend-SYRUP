import React from 'react'
import Avatar from '../ui/Avatar'

const ChatHeader = ({ selectedChat }) => {
  if (!selectedChat) {
    return (
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-user-avatar">C</div>
          <div>
            <div className="chat-user-name">Выберите чат</div>
            <div className="chat-user-status">-</div>
          </div>
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
          <div className="chat-user-status">Онлайн</div>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
