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

import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { useStore } from '../stores/StoreContext'
import MessengerPanel from '../components/messenger/MessengerPanel'
import { getUserById } from '../services/userService'

const Messenger = observer(() => {
  const { chat } = useStore()
  const { userId } = useParams()

  useEffect(() => {
    chat.fetchChats()
  }, [chat])

  useEffect(() => {
    const checkNotificationChat = () => {
      const chatIdToOpen = sessionStorage.getItem('open_chat_id')
      if (chatIdToOpen) {
        sessionStorage.removeItem('open_chat_id')
        
        const chatToOpen = chat.items.find(item => 
          item.chat_id && parseInt(item.chat_id) === parseInt(chatIdToOpen)
        )
        
        if (chatToOpen) {
          chat.selectChat(chatToOpen)
        } else {
          console.warn('Не найден чат с ID:', chatIdToOpen)
        }
      }
    }

    const handleNotificationChat = (event) => {
      const { chatId, senderId, senderInfo } = event.detail
      
      if (chatId) {
        const chatToOpen = chat.items.find(item => 
          item.chat_id && parseInt(item.chat_id) === parseInt(chatId)
        )
        
        if (chatToOpen) {
          chat.selectChat(chatToOpen)
          return
        }
      }
      
      if (senderId) {
        const chatToOpen = chat.items.find(item => 
          item.companion_id && parseInt(item.companion_id) === parseInt(senderId)
        )
        
        if (chatToOpen) {
          chat.selectChat(chatToOpen)
          return
        }
      }
      
      if (senderInfo.login) {
        const synthetic = {
          companion_login: senderInfo.login,
          companion_name: senderInfo.name,
          companion_avatar: senderInfo.avatar,
          companion_id: senderId,
          last_message: '',
          last_message_time: null,
          is_temporary: true,
        }

        chat.setItems([synthetic, ...chat.items])
        chat.selectChat(synthetic)
      }
    }

    if (chat.items.length > 0) {
      checkNotificationChat()
    }

    window.addEventListener('openChatFromNotification', handleNotificationChat)

    return () => {
      window.removeEventListener('openChatFromNotification', handleNotificationChat)
    }
  }, [chat, chat.items])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    let cancelled = false
    const syncFromRoute = async () => {
      const routeId = userId
      
      if (!routeId) {
        if (chat.selectedChat) {
          chat.selectChat(null)
        }
        return
      }
      
      const items = Array.isArray(chat.items) ? chat.items : []

      let found = items.find(c => c.companion_id?.toString() === routeId)

      if (!found) {
        found = items.find(c => c.companion_login === routeId)
      }

      if (!found) {
        try {
          const user = await getUserById(routeId)
          const resolvedLogin = user?.user_info?.login || user?.login
          if (resolvedLogin) {
            found = items.find(c => c.companion_login === resolvedLogin)
            
            if (!found) {
              const synthetic = {
                companion_login: resolvedLogin,
                companion_avatar_key: user?.avatar_key || user?.avatar,
                companion_id: user?.id || user?.user_info?.id,
                last_message: '',
                last_message_time: null,
                is_temporary: true,
              }
              if (!cancelled) {
                chat.setItems([synthetic, ...items])
                chat.selectChat(synthetic)
              }
              return
            }
          }
        } catch (error) {
          console.error('Ошибка при получении пользователя:', error)
          const synthetic = {
            companion_login: routeId,
            companion_avatar_key: undefined,
            last_message: '',
            last_message_time: null,
            is_temporary: true,
          }
          if (!cancelled) {
            chat.setItems([synthetic, ...items])
            chat.selectChat(synthetic)
          }
          return
        }
      }

      if (!cancelled && found) {
        if (chat.selectedChat?.companion_login !== found.companion_login) {
          chat.selectChat(found)
        }
      }
    }

    syncFromRoute()
    
    return () => { cancelled = true }
  }, [userId, chat, chat.items, chat.selectedChat])

  if (chat.loading) return <div className="loading">Загрузка чатов...</div>
  if (chat.error) return <div className="error">Ошибка: {chat.error}</div>

  return (
    <div className="messenger-page">
      <MessengerPanel />
    </div>
  )
})

export default Messenger
