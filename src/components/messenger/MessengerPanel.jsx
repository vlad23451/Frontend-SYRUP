import React from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../stores/StoreContext'
import ChatList from './ChatList'
import MessengerLayout from './MessengerLayout'

const MessengerPanel = observer(() => {
  const { chat } = useStore()
  const navigate = useNavigate()
  
  const totalUnreadCount = chat.getTotalUnreadCount()

  const handleSelectChat = (chatItem) => {
    chat.selectChat(chatItem)
    
    const userId = chat.getChatUserId(chatItem)
    
    const url = `/messenger/${userId}`
    navigate(url)

  }

  return (
    <div className="messenger-container">
      <div className="messenger-sidebar">
        <div className="sidebar-header">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <h3 className="sidebar-title">Чаты</h3>
            {totalUnreadCount > 0 && (
              <div className="unread-badge">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </div>
            )}
          </div>
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
