import { makeAutoObservable, runInAction } from 'mobx'
import { getChats } from '../services/chatService'
import { getUserById } from '../services/userService'

class ChatStore {
  items = []
  loading = false
  error = null
  selectedChat = null
  loadingChatId = false
  unreadCounts = new Map() // chatId -> unread count

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
    // Очищаем непрочитанные сообщения при выборе чата
    if (chat) {
      const chatId = chat.chat_id || chat.companion_id || chat.companionId || chat.id
      if (chatId) {
        this.clearUnreadCount(chatId)
      }
    }
  }

  setLoadingChatId(loading) {
    this.loadingChatId = loading
  }

  // Методы для управления непрочитанными сообщениями
  incrementUnreadCount(chatId) {
    const currentCount = this.unreadCounts.get(chatId) || 0
    this.unreadCounts.set(chatId, currentCount + 1)
  }

  clearUnreadCount(chatId) {
    this.unreadCounts.set(chatId, 0)
  }

  getUnreadCount(chatId) {
    // Сначала проверяем локальное состояние
    const localCount = this.unreadCounts.get(chatId) || 0
    
    // Если есть локальный счетчик, используем его
    if (localCount > 0) {
      return localCount
    }
    
    // Иначе ищем в данных чата из сервера
    const chat = this.items.find(item => {
      const itemId = item.chat_id || item.companion_id || item.companionId || item.id
      return itemId === chatId
    })
    
    return chat?.unread_count || 0
  }

  getTotalUnreadCount() {
    let total = 0
    
    // Считаем из локального состояния
    for (const count of this.unreadCounts.values()) {
      total += count
    }
    
    // Если локального состояния нет, считаем из данных сервера
    if (total === 0) {
      this.items.forEach(chat => {
        const unreadCount = chat.unread_count || 0
        total += unreadCount
      })
    }
    
    return total
  }

  // Обновляем счетчик непрочитанных сообщений на основе прочитанных
  updateUnreadCountFromReadMessages(chatId, readCount) {
    const currentCount = this.getUnreadCount(chatId)
    const newCount = Math.max(0, currentCount - readCount)
    this.unreadCounts.set(chatId, newCount)
  }

  // Сбрасываем счетчик непрочитанных сообщений для чата
  markChatAsRead(chatId) {
    this.unreadCounts.set(chatId, 0)
  }

  getChatUserId(chat) {
    return chat?.companion_id || chat?.companionId || chat?.id
  }

  getChatUserLogin(chat) {
    return chat?.companion_login
  }

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
      
      const updatedItems = [...this.items]
      updatedItems[chatIndex] = updatedChat
      
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

      const enriched = await Promise.all((Array.isArray(data) ? data : []).map(async (chat) => {
        try {
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
        
        // Инициализируем unreadCounts из данных сервера
        this.unreadCounts.clear()
        enriched.forEach(chat => {
          const chatId = chat.chat_id || chat.companion_id || chat.companionId || chat.id
          const unreadCount = chat.unread_count || 0
          if (chatId && unreadCount > 0) {
            this.unreadCounts.set(chatId, unreadCount)
          }
        })
        
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
