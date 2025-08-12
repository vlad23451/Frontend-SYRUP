/**
 * @fileoverview Главный компонент мессенджера
 * 
 * Этот компонент представляет основную структуру мессенджера с WebSocket соединением.
 * Объединяет все компоненты чата в единый интерфейс.
 * 
 * Структура интерфейса:
 * - ChatList: список чатов с пользователями
 * - ChatHeader: заголовок чата с информацией о собеседнике
 * - MessageList: список сообщений
 * - MessageInput: поле ввода новых сообщений
 * 
 * Функциональность:
 * - WebSocket соединение через useSocketMessenger
 * - Отправка и получение сообщений в реальном времени
 * - Отображение списка сообщений
 * - Ввод и отправка новых сообщений
 * - Интеграция с сервером через WebSocket
 * - Управление выбором активного чата
 * 
 * Состояния:
 * - messages: массив сообщений чата
 * - username: имя текущего пользователя
 * - sendMessage: функция отправки сообщения
 * - selectedChat: текущий выбранный чат
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React from 'react'
import { useSocketMessenger } from '../../hooks/messenger/useSocketMessenger'
import ChatList from './ChatList'
import MessengerLayout from './MessengerLayout'

const Messenger = () => {
  const { messages, username, sendMessage } = useSocketMessenger()
  const { chats, loading, error, selectedChat, selectChat } = useChats()

  if (loading) {
    return <div className="loading">Загрузка чатов...</div>
  }

  if (error) {
    return <div className="error">Ошибка: {error.message}</div>
  }

  return (
    <div className="page-container">
      <div className="messenger-container">
        <div className="messenger-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Контакты</h3>
            <p className="sidebar-subtitle">Выберите пользователя для чата</p>
          </div>
          <ChatList 
            chats={chats} 
            selectedChat={selectedChat}
            onSelectChat={selectChat}
          />
        </div>
        <MessengerLayout selectedChat={selectedChat} />
      </div>
    </div>
  )
}

export default Messenger 
