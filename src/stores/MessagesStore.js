import { makeAutoObservable, runInAction } from 'mobx'

import WebSocketStore from './WebSocketStore'
import ChatStore from './ChatStore'
import UserStatusStore from './UserStatusStore'
import { getChatHistory } from '../services/chatService'
import { getUserId } from '../utils/localStorageUtils'
import { pinMessage, unpinMessage, getPinnedMessages } from '../services/pinnedMessagesService'

class MessagesStore {
  items = []
  loading = false
  error = null
  pinned = []
  loadingMore = false
  hasMore = true
  currentChatId = null

  constructor() {
    makeAutoObservable(this)
  }

  setLoading(loading) {
    this.loading = loading
  }

  setError(error) {
    this.error = error
  }

  setLoadingMore(loading) {
    this.loadingMore = loading
  }

  setHasMore(hasMore) {
    this.hasMore = hasMore
  }

  setCurrentChatId(chatId) {
    this.currentChatId = chatId
  }

  setItems(data) {
    // Если data содержит поле messages, извлекаем его, иначе используем data как массив
    const items = data?.messages || data || []
    this.items = items.map(
      (m) => (
        { ...m, id: m.id || `${Date.now()}_${Math.random().toString(36).slice(2,8)}` }
      ))
  }

  prependItems(data, expectedLimit = 100) {
    // Добавляем старые сообщения в начало списка
    const items = data?.messages || data || []
    console.log('prependItems: добавляем', items.length, 'новых сообщений')
    
    const newItems = items.map(
      (m) => (
        { ...m, id: m.id || `${Date.now()}_${Math.random().toString(36).slice(2,8)}` }
      ))
    
    // Бэкенд возвращает сообщения в обратном порядке (последние первыми)
    // Для старых сообщений нам нужно развернуть порядок
    const reversedNewItems = [...newItems].reverse()
    
    // Убираем дубликаты по ID
    const existingIds = new Set(this.items.map(m => m.id))
    const uniqueNewItems = reversedNewItems.filter(m => !existingIds.has(m.id))
    
    console.log('prependItems: уникальных новых сообщений:', uniqueNewItems.length)
    
    this.items = [...uniqueNewItems, ...this.items]
    
    // Если получили меньше сообщений чем запрашивали, значит больше нет
    if (items.length < expectedLimit) {
      console.log('prependItems: достигнут конец истории, hasMore = false')
      this.hasMore = false
    }
  }

  _processMessagesData(data, isInitialLoad = true) {
    // Если data содержит поле messages, извлекаем его, иначе используем data как массив
    const items = data?.messages || data || []
    
    // Извлекаем статус пользователя из данных истории чата
    if (data?.is_online !== undefined && data?.last_seen !== undefined && data?.user_id) {
      UserStatusStore.updateUserStatus(data.user_id, {
        is_online: data.is_online,
        last_seen: data.last_seen,
        timestamp: new Date().toISOString()
      })
      console.log('User status updated from chat history:', { 
        user_id: data.user_id, 
        is_online: data.is_online, 
        last_seen: data.last_seen 
      })
    }
    
    // Бэкенд теперь возвращает сообщения в обратном порядке (последние первыми)
    // Для первой загрузки разворачиваем порядок, чтобы отображать от старых к новым
    const processedItems = items.map(
      (m) => (
        { ...m, id: m.id || `${Date.now()}_${Math.random().toString(36).slice(2,8)}` }
      ))
    
    if (isInitialLoad) {
      console.log('_processMessagesData: разворачиваем порядок сообщений для первой загрузки')
      return processedItems.reverse()
    }
    
    return processedItems
  }

  clearMessages() {
    this.items = []
    this.loading = false
    this.error = null
    this.hasMore = true
    this.currentChatId = null
    this.loadingMore = false
  }

  addMessage(message) {
    const withId = { ...message,
              id: message.id || `${Date.now()}_${Math.random().toString(36).slice(2,8)}` }
    this.items = [...this.items, withId]
  }

  removeMessageAt(index) {
    const removed = this.items[index]
    this.items = this.items.filter((_, i) => i !== index)
    if (removed?.id) {
      this.pinned = this.pinned.filter(p => p.id !== removed.id)
    }
  }

  removeMessageById(messageId) {
    const removed = this.items.find(m => m.id === messageId)
    this.items = this.items.filter(m => m.id !== messageId)
    if (removed?.id) {
      this.pinned = this.pinned.filter(p => p.id !== removed.id)
    }
  }

  editMessageAt(index, newText) {
    this.items = this.items.map((m, i) => (i === index ? { ...m, text: newText } : m))
  }

  editMessageById(messageId, newText) {
    runInAction(() => {
      this.items = this.items.map(m => 
        m.id === messageId ? { 
          ...m, 
          text: newText, 
          edited_at: new Date().toISOString()
        } : m
      )
    })
  }

  removeMessagesByIndices(indices) {
    const removeSet = new Set(indices)
    const removedIds = this.items.filter((_, i) => removeSet.has(i)).map(m => m.id).filter(Boolean)
    this.items = this.items.filter((_, i) => !removeSet.has(i))
    if (removedIds.length) {
      const rem = new Set(removedIds)
      this.pinned = this.pinned.filter(p => !rem.has(p.id))
    }
  }

  async pinMessageById(messageId, scope = 'me', chatId = null) {
    if (!messageId) return

    try {
      const currentChatId = chatId || this.getCurrentChatId()
      if (!currentChatId) {
        console.error('Нет ID чата для закрепления сообщения')
        return
      }

      await pinMessage(currentChatId, messageId)
      
      // Обновляем локальное состояние
      // После закрепления перезагружаем список закрепленных сообщений
      await this.loadPinnedMessages(currentChatId)
    } catch (error) {
      console.error('Ошибка при закреплении сообщения:', error)
      throw error
    }
  }

  async unpinMessageById(messageId, chatId = null) {
    if (!messageId) return

    try {
      const currentChatId = chatId || this.getCurrentChatId()
      if (!currentChatId) {
        console.error('Нет ID чата для открепления сообщения')
        return
      }

      await unpinMessage(currentChatId, messageId)
      
      // Обновляем локальное состояние
      // После открепления перезагружаем список закрепленных сообщений
      await this.loadPinnedMessages(currentChatId)
    } catch (error) {
      console.error('Ошибка при откреплении сообщения:', error)
      throw error
    }
  }

  async loadPinnedMessages(chatId) {
    if (!chatId) return

    try {
      const response = await getPinnedMessages(chatId)
      
      runInAction(() => {
        this.pinned = (response.pinned_messages || []).map(pinned => ({
          id: pinned.id,
          messageId: pinned.message.id,
          scope: 'all', // По умолчанию для всех, можно добавить логику определения
          pinnedAt: pinned.pinned_at,
          pinnedBy: pinned.pinned_by_user,
          message: pinned.message,
          chatTitle: pinned.chat_title,
          companionLogin: pinned.companion_login,
          companionAvatarUrl: pinned.companion_avatar_url
        }))
      })
    } catch (error) {
      console.error('Ошибка при загрузке закрепленных сообщений:', error)
    }
  }

  getCurrentChatId() {
    // Получаем ID текущего чата из ChatStore
    const chatStore = this.getChatStore()
    return chatStore?.selectedChat?.chat_id || chatStore?.selectedChat?.id
  }

  getChatStore() {
    // Получаем ChatStore из контекста
    return window.__mobxStores?.chat
  }

  getPinnedMessages() {
    // Возвращаем закрепленные сообщения в том виде, в котором они пришли с сервера
    return this.pinned
  }

  markOwnMessagesReadUntil(chatId, untilTimestamp, readerUserId) {
    try {
      const currentUserId = getUserId()
      if (!currentUserId || String(currentUserId) === String(readerUserId)) return

      const untilMs = Date.parse(untilTimestamp)
      if (Number.isNaN(untilMs)) return

      let readCount = 0

      runInAction(() => {
        this.items = (this.items || []).map((m) => {
          if (!m) return m

          if (String(m.chat_id) !== String(chatId)) return m
          
          // Помечаем как прочитанные входящие сообщения (не от нас)
          if (m.from_me === true) return m
          
          const timeStr = m.timestamp || m.time
          const t = Date.parse(timeStr)

          if (!Number.isNaN(t)) {
            if (t <= untilMs) {
              readCount++
              return { ...m, is_read: true }
            }
            return m
          }
          
          if (typeof timeStr === 'string' && typeof untilTimestamp === 'string') {
            if (timeStr === untilTimestamp) {
              readCount++
              return { ...m, is_read: true }
            }
            
            const norm = (s) => s.replace(/Z$/, '').replace(/\+\d{2}:?\d{2}$/, '').slice(0, 19)
            if (norm(timeStr) === norm(untilTimestamp)) {
              readCount++
              return { ...m, is_read: true }
            }
          }
          return m
        })
      })

      // Обновляем счетчик непрочитанных сообщений в ChatStore
      if (readCount > 0) {
        import('./ChatStore').then(({ default: ChatStore }) => {
          ChatStore.updateUnreadCountFromReadMessages(chatId, readCount)
        })
      }
    } catch (error) {console.error(error)}
  }

  isNewChat(selectedChat) {
    return !selectedChat || !selectedChat.chat_id
  }

  // Обновляем счетчик непрочитанных сообщений на основе текущего состояния
  updateUnreadCountForChat(chatId) {
    const unreadCount = (this.items || []).filter(m => 
      m.chat_id === chatId && 
      !m.from_me && 
      (m.is_read === false || m.is_read === undefined)
    ).length

    import('./ChatStore').then(({ default: ChatStore }) => {
      if (unreadCount === 0) {
        ChatStore.markChatAsRead(chatId)
      } else {
        ChatStore.unreadCounts.set(chatId, unreadCount)
      }
    })
  }

  async fetchMessages(companionLogin) {
    this.setLoading(true)
    this.setError(null)
    this.setHasMore(true)
    
    try {
      const selectedChat = ChatStore.selectedChat
      
      const isNew = this.isNewChat(selectedChat)
      
      if (isNew) {
        const chatId = await WebSocketStore.sendJoinChat(companionLogin)
        this.setCurrentChatId(chatId)
        
        const data = await getChatHistory(chatId)
        runInAction(() => {
          this.items = this._processMessagesData(data)
          this.loading = false
          // Если получили меньше 100 сообщений, значит больше нет
          if ((data?.messages || data || []).length < 100) {
            this.hasMore = false
          }
        })
      } else {
        const chatId = selectedChat.chat_id
        this.setCurrentChatId(chatId)
        
        const data = await getChatHistory(chatId)
        runInAction(() => {
          this.items = this._processMessagesData(data)
          this.loading = false
          // Если получили меньше 100 сообщений, значит больше нет
          if ((data?.messages || data || []).length < 100) {
            this.hasMore = false
          }
        })
      }
    } catch (error) {
      console.error(error)
      runInAction(() => {
        this.error = error.message
        this.loading = false
      })
    }
  }

  async fetchHistoryByCompanionId(companionId, skip = 0, limit = 100) {
    this.setLoading(true)
    this.setError(null)
    this.setHasMore(true)
    try {
      const selectedChat = ChatStore.selectedChat
      
      const isNew = this.isNewChat(selectedChat)
      
      if (isNew) {
        const chatId = await WebSocketStore.sendJoinChat(companionId)
        const data = await getChatHistory(chatId, skip, limit)
        runInAction(() => {
          this.items = this._processMessagesData(data)
          this.loading = false
          this.currentChatId = chatId
          // Если получили меньше сообщений чем запрашивали, значит больше нет
          if ((data?.messages || data || []).length < limit) {
            this.hasMore = false
          }
        })
      } else {
        const chatId = selectedChat.chat_id
        const data = await getChatHistory(chatId, skip, limit)
        runInAction(() => {
          this.items = this._processMessagesData(data)
          this.loading = false
          this.currentChatId = chatId
          // Если получили меньше сообщений чем запрашивали, значит больше нет
          if ((data?.messages || data || []).length < limit) {
            this.hasMore = false
          }
        })
      }
    } catch (error) {
      runInAction(() => {
        this.error = error.message
        this.loading = false
      })
    }
  }

  async fetchHistoryByChatId(chatId, skip = 0, limit = 100) {
    this.setLoading(true)
    this.setError(null)
    this.setHasMore(true)
    try {
      const data = await getChatHistory(chatId, skip, limit)
      runInAction(() => {
        this.items = this._processMessagesData(data)
        this.loading = false
        // Устанавливаем currentChatId для правильной работы infinite scroll
        this.currentChatId = chatId
        // Если получили меньше сообщений чем запрашивали, значит больше нет
        if ((data?.messages || data || []).length < limit) {
          this.hasMore = false
        }
      })
    } catch (error) {
      runInAction(() => {
        this.error = error.message
        this.loading = false
      })
    }
  }

  async loadMoreMessages() {
    if (this.loadingMore || !this.hasMore || !this.currentChatId) {
      console.log('loadMoreMessages прервано:', {
        loadingMore: this.loadingMore,
        hasMore: this.hasMore,
        currentChatId: this.currentChatId
      })
      return
    }

    console.log('Загрузка дополнительных сообщений для чата:', this.currentChatId, 'skip:', this.items.length)
    this.setLoadingMore(true)
    this.setError(null)

    try {
      const skip = this.items.length
      const data = await getChatHistory(this.currentChatId, skip, 100)
      
      runInAction(() => {
        console.log('Получено дополнительных сообщений:', (data?.messages || data || []).length)
        this.prependItems(data, 100)
        this.loadingMore = false
      })
    } catch (error) {
      console.error('Ошибка при загрузке старых сообщений:', error)
      runInAction(() => {
        this.error = error.message
        this.loadingMore = false
      })
    }
  }
}

const MessageStore = new MessagesStore()

export default MessageStore
