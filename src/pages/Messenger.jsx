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
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../stores/StoreContext'
import MessengerPanel from '../components/messenger/MessengerPanel'
import { getUserById } from '../services/userService'

const Messenger = observer(() => {
  const { chat } = useStore()
  const location = useLocation()
  const { userId } = useParams()
  const navigate = useNavigate()

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
      
      if (!routeId) {
        // Если нет userId в URL, очищаем выбранный чат
        if (chat.selectedChat) {
          chat.selectChat(null)
        }
        return
      }
      
      const items = Array.isArray(chat.items) ? chat.items : []

      // Сначала ищем по companion_id (числовой ID)
      let found = items.find(c => c.companion_id?.toString() === routeId)

      if (!found) {
        // Затем ищем по companion_login
        found = items.find(c => c.companion_login === routeId)
      }

      if (!found) {
        // Если не нашли в существующих чатах, пробуем получить пользователя по API
        try {
          const user = await getUserById(routeId)
          const resolvedLogin = user?.user_info?.login || user?.login
          if (resolvedLogin) {
            // Проверяем, есть ли уже чат с этим пользователем
            found = items.find(c => c.companion_login === resolvedLogin)
            
            if (!found) {
              // Создаем синтетический чат
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
        } catch (e) {
          console.error('Ошибка при получении пользователя:', e)
          // Если не удалось получить пользователя, создаем чат с routeId как логином
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
