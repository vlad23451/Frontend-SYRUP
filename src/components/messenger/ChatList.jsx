import React from "react"
import ChatListEmpty from "./ChatListEmpty"
import ChatItem from "./ChatItem"

const ChatList = ({ chats, selectedChat, onSelectChat = () => {} }) => {
  if (!Array.isArray(chats) || chats.length === 0) {
    return <ChatListEmpty />
  }

  const isChatActive = (chat) => {
    if (!selectedChat) return false
    
    // Проверяем по companion_id
    if (selectedChat.companion_id && chat.companion_id) {
      if (selectedChat.companion_id.toString() === chat.companion_id.toString()) {
        return true
      }
    }
    
    // Проверяем по companion_login
    if (selectedChat.companion_login && chat.companion_login) {
      if (selectedChat.companion_login === chat.companion_login) {
        return true
      }
    }
    
    return false
  }

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <ChatItem 
          key={chat.companion_login || chat.companion_id} 
          chat={chat} 
          isActive={isChatActive(chat)}
          onSelect={onSelectChat}
        />
      ))}
    </div>
  )
}

export default ChatList
