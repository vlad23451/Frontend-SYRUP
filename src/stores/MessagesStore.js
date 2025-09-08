import { makeAutoObservable, runInAction } from 'mobx'
import { getChatHistory } from '../services/chatService'
import WebSocketStore from './WebSocketStore'
import ChatStore from './ChatStore'

/**
 * MessagesStore
 * - Сообщения выбранного чата + закреплённые сообщения
 * - Гарантирует стабильные id для сообщений
 * - Методы для CRUD над списком сообщений и закрепления
 */
class MessagesStore {
  items = []
  loading = false
  error = null
  pinned = [] // [{ id: string, scope: 'me' | 'all' }]

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
    // ensure each message has stable id
    this.items = (items || []).map((m) => ({ ...m, id: m.id || `${Date.now()}_${Math.random().toString(36).slice(2,8)}` }))
  }

  clearMessages() {
    this.items = []
    this.loading = false
    this.error = null
  }

  addMessage(message) {
    const withId = { ...message, id: message.id || `${Date.now()}_${Math.random().toString(36).slice(2,8)}` }
    this.items = [...this.items, withId]
  }

  removeMessageAt(index) {
    const removed = this.items[index]
    this.items = this.items.filter((_, i) => i !== index)
    if (removed?.id) {
      this.pinned = this.pinned.filter(p => p.id !== removed.id)
    }
  }

  editMessageAt(index, newText) {
    this.items = this.items.map((m, i) => (i === index ? { ...m, text: newText } : m))
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

  // Пометить мои сообщения в чате как прочитанные до указанного времени
  markOwnMessagesReadUntil(chatId, untilTimestamp, readerUserId) {
    try {
      const currentUserId = localStorage.getItem('user_id')
      // Если событие пришло от того же пользователя, что и текущий клиент — игнорируем
      if (!currentUserId || String(currentUserId) === String(readerUserId)) return

      const untilMs = Date.parse(untilTimestamp)
      if (Number.isNaN(untilMs)) return

      runInAction(() => {
        this.items = (this.items || []).map((m) => {
          if (!m) return m
          if (String(m.chat_id) !== String(chatId)) return m
          if (m.from_me !== true) return m
          const timeStr = m.timestamp || m.time
          const t = Date.parse(timeStr)
          if (!Number.isNaN(t)) {
            if (t <= untilMs) return { ...m, is_read: true }
            return m
          }
          // Fallback: прямое сравнение строковых значений времени (на случай разных зон/форматов)
          if (typeof timeStr === 'string' && typeof untilTimestamp === 'string') {
            if (timeStr === untilTimestamp) return { ...m, is_read: true }
            // Сравнение по секундам без зоны
            const norm = (s) => s.replace(/Z$/, '').replace(/\+\d{2}:?\d{2}$/, '').slice(0, 19)
            if (norm(timeStr) === norm(untilTimestamp)) return { ...m, is_read: true }
          }
          return m
        })
      })
    } catch (e) {
      // Безопасно игнорируем ошибки преобразования дат
    }
  }

  // Проверяет, является ли чат новым (нет chat_id)
  isNewChat(selectedChat) {
    return !selectedChat || !selectedChat.chat_id
  }

  async fetchMessages(companionLogin) {
    this.setLoading(true)
    this.setError(null)
    
    try {
      // Получаем выбранный чат из ChatStore
      const selectedChat = ChatStore.selectedChat
      
      // Проверяем, является ли чат новым
      const isNew = this.isNewChat(selectedChat)
      
      if (isNew) {
        // Для нового чата отправляем join_chat через WebSocket
        const chatId = await WebSocketStore.sendJoinChat(companionLogin)
        
        // После получения chat_id, получаем историю (которая будет пустой для нового чата)
        const data = await getChatHistory(chatId)
        runInAction(() => {
          this.items = data
          this.loading = false
        })
      } else {
        // Для существующего чата используем chat_id из выбранного чата
        const chatId = selectedChat.chat_id
        
        // Получаем историю сообщений
        const data = await getChatHistory(chatId)
        runInAction(() => {
          this.items = data
          this.loading = false
        })
      }
    } catch (error) {
      console.error('Ошибка в fetchMessages:', error)
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
      // Получаем выбранный чат из ChatStore
      const selectedChat = ChatStore.selectedChat
      
      // Проверяем, является ли чат новым
      const isNew = this.isNewChat(selectedChat)
      
      if (isNew) {
        // Для нового чата отправляем join_chat через WebSocket
        const chatId = await WebSocketStore.sendJoinChat(companionId)
        const data = await getChatHistory(chatId, skip, limit)
        runInAction(() => {
          this.items = data 
          this.loading = false
        })
      } else {
        // Для существующего чата используем chat_id из выбранного чата
        const chatId = selectedChat.chat_id
        const data = await getChatHistory(chatId, skip, limit)
        runInAction(() => {
          this.items = data 
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
        this.items = data
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
