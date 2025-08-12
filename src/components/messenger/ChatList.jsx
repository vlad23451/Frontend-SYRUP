import React from "react"
import ChatListEmpty from "./ChatListEmpty"
import ChatItem from "./ChatItem"

const ChatList = ({ chats, selectedChat, onSelectChat = () => {} }) => {
  if (!Array.isArray(chats) || chats.length === 0) {
    return <ChatListEmpty />
  }

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <ChatItem 
          key={chat.companion_login} 
          chat={chat} 
          isActive={selectedChat?.companion_login === chat.companion_login}
          onSelect={onSelectChat}
        />
      ))}
    </div>
  )
}

export default ChatList
