import { makeAutoObservable, runInAction } from 'mobx'
import { getChats } from '../services/chatService'
import { getUserById } from '../services/userService'

/**
 * ChatStore
 * - Управляет списком чатов, выбранным чатом и состояниями загрузки
 * - Источник данных: chatService.getChats
 */
class ChatStore {
  items = []
  loading = false
  error = null
  selectedChat = null
  loadingChatId = false

  constructor() {
    makeAutoObservable(this)
  }

  setLoading(loading) {
    this.loading = loading
  }

  setError(error) {
    this.error = error
  }

  setItems(items) {
    this.items = items
  }

  selectChat(chat) {
    this.selectedChat = chat
  }

  setLoadingChatId(loading) {
    this.loadingChatId = loading
  }

  // Получить ID пользователя из чата
  getChatUserId(chat) {
    return chat?.companion_id || chat?.companionId || chat?.id
  }

  // Получить логин пользователя из чата
  getChatUserLogin(chat) {
    return chat?.companion_login
  }

  // Обновить последнее сообщение в чате
  updateLastMessage(chatId, message) {
    const chatIndex = this.items.findIndex(chat => 
      chat.chat_id === chatId || 
      chat.id === chatId
    )
    
    if (chatIndex !== -1) {
      const updatedChat = {
        ...this.items[chatIndex],
        last_message: message.text,
        last_message_time: message.timestamp || message.time
      }
      
      // Создаем новый массив с обновленным чатом
      const updatedItems = [...this.items]
      updatedItems[chatIndex] = updatedChat
      
      // Перемещаем обновленный чат в начало списка
      updatedItems.splice(chatIndex, 1)
      updatedItems.unshift(updatedChat)
      
      this.setItems(updatedItems)
      
    } else {
    }
  }

  async fetchChats() {
    this.setLoading(true)
    this.setError(null)
    
    try {
      const data = await getChats()

      // Обогащаем данные чатов информацией о пользователях по companion_id
      const enriched = await Promise.all((Array.isArray(data) ? data : []).map(async (chat) => {
        try {
          // Если уже есть ключ аватара — оставляем как есть
          if (!chat?.companion_id || chat?.companion_avatar_key) return chat

          const user = await getUserById(chat.companion_id)
          const avatarKey = user?.user_info?.avatar_key || user?.avatar_key || user?.avatar
          const login = user?.user_info?.login || user?.login || chat?.companion_login

          return {
            ...chat,
            companion_avatar_key: avatarKey,
            companion_login: chat?.companion_login || login
          }
        } catch (_) {
          return chat
        }
      }))

      runInAction(() => {
        this.items = enriched
        this.loading = false
      })
    } catch (error) {
      runInAction(() => {
        this.error = error.message
        this.loading = false
      })
    }
  }
}

export default new ChatStore() 
