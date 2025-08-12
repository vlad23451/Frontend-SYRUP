import { makeAutoObservable, runInAction } from 'mobx'
import { getChats } from '../services/chatService'

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

  async fetchChats() {
    this.setLoading(true)
    this.setError(null)
    
    try {
      const data = await getChats()
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

export default new ChatStore() 
