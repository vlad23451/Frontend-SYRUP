import { makeAutoObservable, runInAction } from 'mobx'
import MessagesStore from './MessagesStore'
import NotificationService from '../services/notificationService'
import { getUserId, getUserLogin } from '../utils/localStorageUtils'
import UserStatusStore from './UserStatusStore'

class WebSocketStore {
  connection = null
  isConnected = false
  error = null
  currentChatId = null
  pendingChatRequests = new Map()

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
          
          // Обновляем счетчик непрочитанных сообщений
          import('./ChatStore').then(({ default: ChatStore }) => {
            // Если это не наш пользователь читает сообщения, обновляем счетчик
            const currentUserId = getUserId()
            if (readerUserId && currentUserId && parseInt(readerUserId) !== parseInt(currentUserId)) {
              // Подсчитываем количество прочитанных сообщений
              const items = MessagesStore.items || []
              const readMessages = items.filter(m => 
                m.chat_id === chatId && 
                !m.from_me && 
                m.timestamp && 
                new Date(m.timestamp) <= new Date(until)
              )
              ChatStore.updateUnreadCountFromReadMessages(chatId, readMessages.length)
            }
          })
        }
      } catch (e) {
        console.error('Ошибка обработки read/mark_as_read:', e)
      }
    } else if (data.type === 'message' || data.message_type === 'text') {
      
      const currentUserId = getUserId()
      const fromMe = data.sender_id && currentUserId && parseInt(data.sender_id) === parseInt(currentUserId)
      
      const messageObj = {
        id: data.id,
        text: data.text,
        sender_id: data.sender_id,
        chat_id: data.chat_id,
        timestamp: data.timestamp,
        from_me: fromMe,
        is_read: fromMe ? undefined : false,
        message_type: data.message_type || 'text',
        metadata: data.metadata || {},
        edited_at: data.edited_at || null,
        attached_files: data.attached_files || [] // Добавляем поддержку прикрепленных файлов
      }
      
      import('./ChatStore').then(({ default: ChatStore }) => {
        const selectedChat = ChatStore.selectedChat
        const selectedChatId = selectedChat?.chat_id
        
        // Проверяем, не является ли это отредактированным сообщением
        const existingMessage = MessagesStore.items.find(m => m.id === data.id)
        
        if (selectedChatId && parseInt(selectedChatId) === parseInt(data.chat_id)) {
          
          console.log('WebSocket message received:', {
            id: data.id,
            text: data.text,
            edited_at: data.edited_at,
            messageType: data.type || data.message_type,
            existingMessage: !!existingMessage,
            attachedFiles: data.attached_files || []
          })
          
          if (existingMessage && (data.edited_at || data.type === 'message_edited')) {
            // Обновляем существующее сообщение с данными с сервера
            runInAction(() => {
              MessagesStore.items = MessagesStore.items.map(m => 
                m.id === data.id ? { 
                  ...m, 
                  text: data.text, 
                  edited_at: data.edited_at || new Date().toISOString(),
                  attached_files: data.attached_files || m.attached_files || []
                } : m
              )
            })
          } else {
            MessagesStore.addMessage(messageObj)
          }
        } else {
          // Если чат не выбран, увеличиваем счетчик непрочитанных сообщений
          if (!fromMe) {
            ChatStore.incrementUnreadCount(data.chat_id)
          }
        }
        // Для отредактированных сообщений не обновляем last_message и не перемещаем чат
        if (existingMessage && (data.edited_at || data.type === 'message_edited')) {
          // Не обновляем last_message для отредактированных сообщений
          // Только обновляем само сообщение в списке
        } else {
          ChatStore.updateLastMessage(data.chat_id, messageObj)
        }
        
        if (!fromMe) {
          this.showNotificationForMessage(messageObj, data, ChatStore)
        }
      }).catch(err => {
        console.error('Ошибка обновления чата:', err)
      })
    } else if (data.type === 'message_deleted') {
      // Обработка удаления сообщения
      try {
        MessagesStore.removeMessageById(data.id)
        console.log('Сообщение удалено:', data.id)
      } catch (error) {
        console.error('Ошибка удаления сообщения:', error)
      }
    } else if (data.type === 'message_edited') {
      // Обработка редактирования сообщения
      try {
        // Обновляем сообщение с edited_at из сервера
        runInAction(() => {
          MessagesStore.items = MessagesStore.items.map(m => 
            m.id === data.id ? { 
              ...m, 
              text: data.text, 
              edited_at: data.edited_at || new Date().toISOString(),
              attached_files: data.attached_files || m.attached_files || []
            } : m
          )
        })
        
        // Не обновляем last_message для отредактированных сообщений
        // last_message должно показывать последнее сообщение по времени отправки, а не редактирования
      } catch (error) {
        console.error('Ошибка редактирования сообщения:', error)
      }
    } else if (data.type === 'user_status_changed') {
      // Обработка изменения статуса пользователя
      try {
        const { user_id, is_online, last_seen, timestamp } = data
        if (user_id) {
          UserStatusStore.updateUserStatus(user_id, {
            is_online,
            last_seen,
            timestamp
          })
          console.log('User status updated:', { user_id, is_online, last_seen })
        }
      } catch (error) {
        console.error('Ошибка обновления статуса пользователя:', error)
      }
    } else {
    }
  }

  showNotificationForMessage(messageObj, rawData, ChatStore) {
    try {
      const senderInfo = this.getSenderInfo(ChatStore, rawData)

      NotificationService.showMessageNotification(messageObj, senderInfo)
    } catch (error) {
      console.error('Ошибка показа уведомления:', error)
    }
  }

  getSenderInfo(ChatStore, rawMessageData = {}) {
    try {
      if (rawMessageData.sender_login) {
        return {
          login: rawMessageData.sender_login,
          avatar: rawMessageData.sender_avatar,
          sender_id: rawMessageData.sender_id
        }
      }

      const chat = ChatStore?.items?.find(item => 
        item.chat_id && parseInt(item.chat_id) === parseInt(rawMessageData.chat_id)
      )
      
      if (chat) {
        return {
          title: chat.title,
          login: chat.companion_login,
          avatar: chat.companion_avatar
        }
      }
      
      const chatBySender = ChatStore?.items?.find(item => 
        item.companion_id && parseInt(item.companion_id) === parseInt(rawMessageData.sender_id)
      )
      
      if (chatBySender) {
        return {
          title: chatBySender.title,
          login: chatBySender.companion_login,
          avatar: chatBySender.companion_avatar
        }
      }
      
    } catch (error) {
      console.error('Ошибка получения информации об отправителе:', error)
      return {
        login: 'unknown',
        avatar: 'unknown'
      }
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

  // Обновленный метод для отправки сообщений с прикрепленными файлами
  sendTextMessage(senderId, chatId, text, attachedFileIds = []) {
    if (!this.connection || !this.isConnected) {
      console.error('WebSocket не подключен')
      return false
    }

    try {
      const senderLogin = getUserLogin()

      const message = {
        type: "send_message",
        sender_id: parseInt(senderId),
        sender_login: senderLogin,
        chat_id: parseInt(chatId),
        text: String(text)
      }

      // Добавляем прикрепленные файлы, если они есть
      if (attachedFileIds && attachedFileIds.length > 0) {
        // attachedFileIds является массивом ID файлов
        message.attached_files = attachedFileIds
        console.log('Отправляем WebSocket сообщение с файлами:', message)
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

  sendDeleteMessage(messageId) {
    if (!this.connection || !this.isConnected) {
      console.error('WebSocket не подключен')
      return false
    }

    try {
      const payload = {
        type: 'delete_message',
        message_id: parseInt(messageId)
      }
      this.connection.send(JSON.stringify(payload))
      return true
    } catch (error) {
      console.error('Ошибка отправки delete_message:', error)
      this.setError(error.message)
      return false
    }
  }

  sendEditMessage(messageId, newText) {
    if (!this.connection || !this.isConnected) {
      console.error('WebSocket не подключен')
      return false
    }

    try {
      const payload = {
        type: 'edit_message',
        message_id: parseInt(messageId),
        text: String(newText)
      }
      this.connection.send(JSON.stringify(payload))
      return true
    } catch (error) {
      console.error('Ошибка отправки edit_message:', error)
      this.setError(error.message)
      return false
    }
  }
}

const webSocketStore = new WebSocketStore()

export default webSocketStore
