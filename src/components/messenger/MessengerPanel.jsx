import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../stores/StoreContext'
import ChatList from './ChatList'
import MessengerLayout from './MessengerLayout'

const MessengerPanel = observer(() => {
  const { chat } = useStore()

  const handleSelectChat = (chatItem) => {
    chat.selectChat(chatItem)
  }

  return (
    <div className="messenger-container">
      <div className="messenger-sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Контакты</h3>
          <p className="sidebar-subtitle">Выберите пользователя для чата</p>
        </div>
        <ChatList 
          chats={chat.items} 
          selectedChat={chat.selectedChat}
          onSelectChat={handleSelectChat}
        />
      </div>
      <MessengerLayout selectedChat={chat.selectedChat} />
    </div>
  )
})

export default MessengerPanel


