/**
 * @fileoverview Страница мессенджера с чатами
 * 
 * Этот компонент представляет основную страницу мессенджера, которая содержит:
 * - Список чатов с пользователями (левая панель)
 * - Историю сообщений выбранного чата (правая панель)
 * - Функциональность выбора и отображения чатов
 * 
 * Структура интерфейса:
 * - Левая панель (320px): список всех чатов пользователя
 * - Правая панель: история сообщений выбранного чата
 * 
 * Функциональность:
 * - Отображение списка чатов через ChatList
 * - Выбор активного чата
 * - Отображение истории сообщений через ChatHistory
 * - Интеграция с хуками useChats и useChatMessages
 * - Обработка выбора чата через handleChatSelect
 * 
 * Состояния:
 * - selectedChat: текущий выбранный чат
 * - chats: список всех чатов пользователя
 * - messages: сообщения выбранного чата
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/StoreContext'
import ChatList from '../components/messenger/ChatList'
import MessengerModal from '../components/messenger/MessengerModal'

const Messenger = observer(() => {
  const { chat } = useStore()
  const [isModalOpen, setModalOpen] = useState(false)
  const containerRef = useRef(null)
  const grabRef = useRef(null)

  useEffect(() => {
    chat.fetchChats()
  }, [chat])

  const handleSelectChat = (chatItem) => {
    chat.selectChat(chatItem)
    setModalOpen(true)
  }

  useEffect(() => {
    const container = containerRef.current
    const handle = grabRef.current
    if (!container || !handle) return
    let isDragging = false
    let startX = 0, startY = 0, startLeft = 0, startTop = 0
    const onDown = (e) => {
      e.preventDefault()
      isDragging = true
      handle.setPointerCapture(e.pointerId)
      startX = e.clientX
      startY = e.clientY
      const rect = container.getBoundingClientRect()
      startLeft = rect.left
      startTop = rect.top
      handle.style.cursor = 'grabbing'
    }
    const onMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const vw = window.innerWidth
      const vh = window.innerHeight
      const rect = container.getBoundingClientRect()
      const newLeft = Math.max(8, Math.min(vw - rect.width - 8, startLeft + dx))
      const newTop = Math.max(8, Math.min(vh - rect.height - 8, startTop + dy))
      container.style.left = newLeft + 'px'
      container.style.top = newTop + 'px'
      container.style.position = 'fixed'
      container.style.margin = '0'
      container.style.transform = 'none'
    }
    const onUp = (e) => {
      isDragging = false
      try { handle.releasePointerCapture(e.pointerId) } catch {}
      handle.style.cursor = 'grab'
    }
    handle.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      handle.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  if (chat.loading) {
    return <div className="loading">Загрузка чатов...</div>
  }

  if (chat.error) {
    return <div className="error">Ошибка: {chat.error}</div>
  }

  return (
    <div className="page-container">
      <div 
        className="messenger-container contacts-only" 
        ref={containerRef}
        style={{ position: 'fixed', left: '50%', top: '15vh', transform: 'translateX(-50%)', cursor: 'grab' }}
      >
        <div className="sidebar-header">
          <h3 className="sidebar-title">Контакты</h3>
          <p className="sidebar-subtitle">Выберите пользователя для чата</p>
        </div>
        <ChatList 
          chats={chat.items} 
          selectedChat={chat.selectedChat}
          onSelectChat={handleSelectChat}
        />
        <div className="modal-drag-handle bottom external" ref={grabRef} title="Переместить" style={{ cursor: 'grab' }} />
        <div className="modal-drag-visible bottom external" />
      </div>
      <MessengerModal open={isModalOpen} selectedChat={chat.selectedChat} onClose={() => setModalOpen(false)} />
    </div>
  )
})

export default Messenger
