import { makeAutoObservable } from 'mobx'
import MessagesStore from './MessagesStore'

/**
 * WebSocketStore
 * - Управляет WebSocket соединением и отправкой сообщений
 * - Хранит состояние соединения и предоставляет методы для отправки
 * - Обрабатывает ответы от сервера, включая chat_id
 */
class WebSocketStore {
  connection = null
  isConnected = false
  error = null
  currentChatId = null
  pendingChatRequests = new Map() // companionId -> { resolve, reject, timeout }

  constructor() {
    makeAutoObservable(this)
  }

  setConnection(connection) {
    this.connection = connection
    this.isConnected = connection?.readyState === WebSocket.OPEN
  }

  setConnected(connected) {
    this.isConnected = connected
  }

  setError(error) {
    this.error = error
  }

  setCurrentChatId(chatId) {
    this.currentChatId = chatId
  }

  handleIncomingMessage(data) {
    if (data.type === 'joined' && data.chat_id) {
      this.setCurrentChatId(data.chat_id)
      
      this.notifyChatIdReceived(data.chat_id, data.companion_id)
    } else if (
      data.type === 'mark_as_read' ||
      data.message_type === 'mark_as_read' ||
      data.type === 'read' ||
      data.message_type === 'read'
    ) {
      try {
        const chatId = data.chat_id ?? data.room_id ?? data.chatId
        const readerUserId = data.user_id ?? data.reader_id
        const until = data.until_timestamp ?? data.until
        if (chatId && until) {
          MessagesStore.markOwnMessagesReadUntil(chatId, until, readerUserId)
        }
      } catch (e) {
        console.error('Ошибка обработки read/mark_as_read:', e)
      }
    } else if (data.type === 'message' || data.message_type === 'text') {
      
      const currentUserId = localStorage.getItem('user_id')
      const fromMe = data.sender_id && currentUserId && parseInt(data.sender_id) === parseInt(currentUserId)
      
      const messageObj = {
        id: data.id,
        text: data.text,
        sender_id: data.sender_id,
        chat_id: data.chat_id,
        timestamp: data.timestamp,
        time: data.timestamp, // для обратной совместимости
        from_me: fromMe,
        is_read: fromMe ? undefined : false,
        message_type: data.message_type || 'text',
        metadata: data.metadata || {}
      }
      
      import('./ChatStore').then(({ default: ChatStore }) => {
        const selectedChat = ChatStore.selectedChat
        const selectedChatId = selectedChat?.chat_id
        
        if (selectedChatId && parseInt(selectedChatId) === parseInt(data.chat_id)) {
          MessagesStore.addMessage(messageObj)
        } else {}
        ChatStore.updateLastMessage(data.chat_id, messageObj)
      }).catch(err => {
        console.error('Ошибка обновления чата:', err)
      })
    } else {
    }
  }

  notifyChatIdReceived(chatId, companionId) {
    if (!companionId) {
      if (this.pendingChatRequests.size === 1) {
        const [storedCompanionId, pendingRequest] = this.pendingChatRequests.entries().next().value
        clearTimeout(pendingRequest.timeout)
        this.pendingChatRequests.delete(storedCompanionId)
        pendingRequest.resolve(chatId)
        return
      } else if (this.pendingChatRequests.size > 1) {
        return
      }
    }
    
    const pendingRequest = this.pendingChatRequests.get(companionId)
    if (pendingRequest) {
      clearTimeout(pendingRequest.timeout)
      this.pendingChatRequests.delete(companionId)
      pendingRequest.resolve(chatId)
    } else {
    }
  }

  async sendJoinChat(companionId) {    
    if (!this.connection || !this.isConnected) {
      console.error('WebSocket не подключен')
      return Promise.reject(new Error('WebSocket не подключен'))
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingChatRequests.delete(companionId)
        reject(new Error('Таймаут ожидания chat_id'))
      }, 10000)

      this.pendingChatRequests.set(companionId, { resolve, reject, timeout })

      try {
        const message = {
          type: "join_chat",
          companion_id: companionId
        }
        
        this.connection.send(JSON.stringify(message))
      } catch (error) {
        console.error('Ошибка отправки join_chat:', error)
        this.pendingChatRequests.delete(companionId)
        clearTimeout(timeout)
        reject(error)
      }
    })
  }


  sendTextMessage(senderId, chatId, text) {
    if (!this.connection || !this.isConnected) {
      console.error('WebSocket не подключен')
      return false
    }

    try {
      const message = {
        type: "send_message",
        sender_id: parseInt(senderId),
        chat_id: parseInt(chatId),
        text: String(text)
      }
      
      this.connection.send(JSON.stringify(message))
      return true
    } catch (error) {
      console.error('Ошибка отправки send_message:', error)
      this.setError(error.message)
      return false
    }
  }

  sendMessage(message) {
    if (!this.connection || !this.isConnected) {
      console.error('WebSocket не подключен')
      return false
    }

    try {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message)
      this.connection.send(messageStr)
      return true
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error)
      this.setError(error.message)
      return false
    }
  }


  sendMarkAsRead(chatId, userId, untilTimestamp) {
    if (!this.connection || !this.isConnected) {
      console.error('WebSocket не подключен')
      return false
    }

    let untilIso = untilTimestamp

    try {
      const payload = {
        type: 'mark_as_read',
        chat_id: parseInt(chatId),
        user_id: parseInt(userId),
        until_timestamp: untilIso
      }
      this.connection.send(JSON.stringify(payload))
      return true
    } catch (error) {
      console.error('Ошибка отправки mark_as_read:', error)
      this.setError(error.message)
      return false
    }
  }
}

export default new WebSocketStore()
