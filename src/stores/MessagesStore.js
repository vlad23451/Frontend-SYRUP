import { makeAutoObservable, runInAction } from 'mobx'
import { getChatMessages } from '../services/chatService'

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

  async fetchMessages(companionLogin) {
    this.setLoading(true)
    this.setError(null)
    
    try {
      const data = await getChatMessages(companionLogin)
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
