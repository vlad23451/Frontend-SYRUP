import { makeAutoObservable, runInAction } from 'mobx'

import WebSocketStore from './WebSocketStore'
import ChatStore from './ChatStore'
import UserStatusStore from './UserStatusStore'
import { getChatHistory } from '../services/chatService'
import { getUserId } from '../utils/localStorageUtils'

class MessagesStore {
  items = []
  loading = false
  error = null
  pinned = []

  constructor() {
    makeAutoObservable(this)
  }

  setLoading(loading) {
    this.loading = loading
  }

  setError(error) {
    this.error = error
  }

  setItems(data) {
    // Если data содержит поле messages, извлекаем его, иначе используем data как массив
    const items = data?.messages || data || []
    this.items = items.map(
      (m) => (
        { ...m, id: m.id || `${Date.now()}_${Math.random().toString(36).slice(2,8)}` }
      ))
  }

  _processMessagesData(data) {
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
    
    return items.map(
      (m) => (
        { ...m, id: m.id || `${Date.now()}_${Math.random().toString(36).slice(2,8)}` }
      ))
  }

  clearMessages() {
    this.items = []
    this.loading = false
    this.error = null
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

  pinMessageById(id, scope = 'me') {
    if (!id) return

    const exists = this.pinned.some(p => p.id === id && p.scope === scope)

    if (!exists) this.pinned = [...this.pinned, { id, scope }]
  }

  unpinMessageById(id) {
    if (!id) return

    this.pinned = this.pinned.filter(p => p.id !== id)
  }

  getPinnedMessages() {
    const idToMsg = new Map(this.items.map(m => [m.id, m]))
    
    return this.pinned
      .map(p => ({ ...p, message: idToMsg.get(p.id)}))
      .filter(x => x.message)
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
    
    try {
      const selectedChat = ChatStore.selectedChat
      
      const isNew = this.isNewChat(selectedChat)
      
      if (isNew) {
        const chatId = await WebSocketStore.sendJoinChat(companionLogin)
        
        const data = await getChatHistory(chatId)
        runInAction(() => {
          this.items = this._processMessagesData(data)
          this.loading = false
        })
      } else {
        const chatId = selectedChat.chat_id
        
        const data = await getChatHistory(chatId)
        runInAction(() => {
          this.items = this._processMessagesData(data)
          this.loading = false
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

  async fetchHistoryByCompanionId(companionId, skip = 0, limit = 50) {
    this.setLoading(true)
    this.setError(null)
    try {
      const selectedChat = ChatStore.selectedChat
      
      const isNew = this.isNewChat(selectedChat)
      
      if (isNew) {
        const chatId = await WebSocketStore.sendJoinChat(companionId)
        const data = await getChatHistory(chatId, skip, limit)
        runInAction(() => {
          this.items = this._processMessagesData(data)
          this.loading = false
        })
      } else {
        const chatId = selectedChat.chat_id
        const data = await getChatHistory(chatId, skip, limit)
        runInAction(() => {
          this.items = this._processMessagesData(data)
          this.loading = false
        })
      }
    } catch (error) {
      runInAction(() => {
        this.error = error.message
        this.loading = false
      })
    }
  }

  async fetchHistoryByChatId(chatId, skip = 0, limit = 50) {
    this.setLoading(true)
    this.setError(null)
    try {
      const data = await getChatHistory(chatId, skip, limit)
      runInAction(() => {
        this.items = this._processMessagesData(data)
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

const MessageStore = new MessagesStore()

export default MessageStore
