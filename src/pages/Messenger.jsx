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
import { useLocation, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/StoreContext'
import MessengerPanel from '../components/messenger/MessengerPanel'
import { getUserById } from '../services/userService'

const Messenger = observer(() => {
  const { chat } = useStore()
  const location = useLocation()
  const { userId } = useParams()

  useEffect(() => {
    chat.fetchChats()
  }, [chat])

  // Lock global scroll while on messenger page
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Ensure chat from route /messenger/:userId
  useEffect(() => {
    let cancelled = false
    const syncFromRoute = async () => {
      const routeId = userId
      if (!routeId) return
      const items = Array.isArray(chat.items) ? chat.items : []

      // Treat routeId as login first
      let login = routeId
      let found = items.find(c => c.companion_login === login)

      if (!found) {
        // Try resolve numeric id → user login via API
        try {
          const user = await getUserById(routeId)
          const resolvedLogin = user?.user_info?.login || user?.login
          if (resolvedLogin) {
            login = resolvedLogin
            found = (Array.isArray(chat.items) ? chat.items : []).find(c => c.companion_login === login)
            if (!found) {
              const synthetic = {
                companion_login: login,
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
        } catch (e) {
          // If failed to resolve, still create synthetic chat using routeId as login
          const synthetic = {
            companion_login: login,
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
