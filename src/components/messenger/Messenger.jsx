import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useSocketMessenger } from '../../hooks/messenger/useSocketMessenger'
import ChatList from './ChatList'
import MessengerLayout from './MessengerLayout'
import GlobalSearchModal from '../search/GlobalSearchModal'
import { useStore } from '../../stores/StoreContext'

const Messenger = observer(() => {
  const { messages, username, sendMessage } = useSocketMessenger()
  const { chat } = useStore()
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false)

  useEffect(() => {
    chat.fetchChats()
  }, [chat])

  if (chat.loading) {
    return <div className="loading">Загрузка чатов...</div>
  }

  if (chat.error) {
    return <div className="error">Ошибка: {chat.error}</div>
  }

  return (
    <div className="page-container">
      <div className="messenger-container">
        <div className="messenger-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Контакты</h3>
            <p className="sidebar-subtitle">Выберите пользователя для чата</p>
            <button 
              className="sidebar-search-btn"
              onClick={() => setIsGlobalSearchOpen(true)}
              title="Поиск по всем чатам"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Поиск
            </button>
          </div>
          <ChatList 
            chats={chat.chats} 
            selectedChat={chat.selectedChat}
            onSelectChat={chat.selectChat}
          />
        </div>
        <MessengerLayout selectedChat={chat.selectedChat} />
      </div>
      
      <GlobalSearchModal 
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
      />
    </div>
  )
}
)

export default Messenger 
