import React from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../stores/StoreContext'
import ChatList from './ChatList'
import MessengerLayout from './MessengerLayout'

const MessengerPanel = observer(() => {
  const { chat } = useStore()
  const navigate = useNavigate()

  const handleSelectChat = (chatItem) => {
    chat.selectChat(chatItem)
    
    const userId = chat.getChatUserId(chatItem)
    
    if (userId) {
      const url = `/messenger/${userId}`
      navigate(url)
    } else {
      const login = chat.getChatUserLogin(chatItem)
      if (login) {
        const url = `/messenger/${login}`
        navigate(url)
      }
    }
  }

  return (
    <div className="messenger-container">
      <div className="messenger-sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Чаты</h3>
          <p className="sidebar-subtitle">Выберите чат</p>
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
