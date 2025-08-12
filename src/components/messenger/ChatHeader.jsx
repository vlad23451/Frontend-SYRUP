import React from 'react'

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
        <img 
          src={selectedChat.companion_avatar_url || "/default-avatar.png"} 
          alt="Аватар" 
          className="chat-user-avatar"
          width={40}
          height={40}
        />
        <div>
          <div className="chat-user-name">{selectedChat.companion_login}</div>
          <div className="chat-user-status">Онлайн</div>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
