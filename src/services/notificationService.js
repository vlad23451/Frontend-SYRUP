/**
 * @fileoverview Сервис для управления браузерными push уведомлениями
 * 
 * Функциональность:
 * - Показ уведомлений о новых сообщениях
 * - Проверка состояния окна (фокус/не в фокусе)
 */

class NotificationService {
  constructor() {
    this.isWindowFocused = true
    this.notificationsEnabled = true

    this.initWindowFocusTracking()
  }

  initWindowFocusTracking() {
    window.addEventListener('focus', () => {
      this.isWindowFocused = true
    })

    window.addEventListener('blur', () => {
      this.isWindowFocused = false
    })

    document.addEventListener('visibilitychange', () => {
      this.isWindowFocused = !document.hidden
    })
  }

  isOnMessengerPage() {
    try {
      const currentPath = window.location.pathname
      return currentPath.startsWith('/messenger')
    } catch (error) {
      console.warn('Не удалось определить текущую страницу:', error)
      return false
    }
  }

  shouldShowNotification(messageData, currentChatId) {
    if (!this.notificationsEnabled) {
      return false
    }

    if (messageData.from_me) {
      return false
    }

    const shouldShow = !this.isWindowFocused || !this.isOnMessengerPage()
    
    if (!shouldShow) {
      return false
    }

    return true
  }

  showMessageNotification(messageData, senderInfo = {}) {
    if (!this.shouldShowNotification(messageData)) {
      return null
    }

    try {
      const messageText = messageData.text
      const truncatedText = messageText.length > 50 
        ? messageText.substring(0, 50) + '...' 
        : messageText

      this.showCustomNotification({
        senderName: senderInfo.login,
        messageText: truncatedText,
        senderInfo,
        autoCloseDelay: 10000, 
        onClick: () => {
          window.focus()
          
          this.openChatFromNotification(messageData, senderInfo)
        }
      })

      return true

    } catch (error) {
      console.error("Ошибка показа уведомления:", error)
      return null
    }
  }

  showCustomNotification(notificationData) {
    try {
      if (window.CustomNotifications?.add) {
        window.CustomNotifications.add(notificationData)
      } else {
        const event = new CustomEvent('showCustomNotification', {
          detail: notificationData
        })
        window.dispatchEvent(event)
      }

      return true
    } catch (error) {
      console.error('Ошибка показа кастомного уведомления:', error)
      return false
    }
  }

  openChatFromNotification(messageData, senderInfo) {
    try {
      
      const chatUrl = `/messenger/${senderInfo.sender_id}`

      if (window.location.pathname !== chatUrl) {
        window.location.href = chatUrl
      } else {
        const event = new CustomEvent('openChatFromNotification', {
          detail: {
            chatId: messageData.chat_id,
            senderId: senderInfo.sender_id,
            senderInfo: senderInfo
          }
        })
        window.dispatchEvent(event)
      }
      
    } catch (error) {
      console.error('Ошибка открытия чата из уведомления:', error)
      if (window.location.pathname !== '/messenger') {
        window.location.href = '/messenger'
      }
    }
  }

  getStatus() {
    return {
      enabled: this.notificationsEnabled,
      windowFocused: this.isWindowFocused,
      supported: 'Notification' in window,
      currentPage: window.location.pathname,
      onMessengerPage: this.isOnMessengerPage(),
      willShowNotifications: this.notificationsEnabled && (!this.isWindowFocused || !this.isOnMessengerPage())
    }
  }
}

export default new NotificationService()
