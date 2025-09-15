/**
 * @fileoverview Контейнер для управления кастомными уведомлениями
 * 
 * Функциональность:
 * - Отображение стека уведомлений
 * - Автоматическое управление позиционированием
 * - Ограничение максимального количества уведомлений
 * - Анимации появления/исчезновения
 */

import React, { useState, useCallback, useEffect } from 'react'
import CustomNotification from './CustomNotification'

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([])
  const [recentMessages, setRecentMessages] = useState(new Set())
  const maxNotifications = 5 

  const addNotification = useCallback((notificationData) => {
    const messageKey = `${notificationData.senderInfo?.sender_id || 'unknown'}_${notificationData.messageText}_${Math.floor(Date.now() / 1000)}`
    
    if (recentMessages.has(messageKey)) {
      return null
    }

    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      ...notificationData,
      timestamp: Date.now(),
      messageKey
    }

    setRecentMessages(prev => {
      const updated = new Set(prev)
      updated.add(messageKey)
      
      const cleanupTime = Date.now() - 10000
      for (const key of updated) {
        const keyTime = parseInt(key.split('_').pop()) * 1000
        if (keyTime < cleanupTime) {
          updated.delete(key)
        }
      }
      
      return updated
    })

    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      if (updated.length > maxNotifications) {
        return updated.slice(0, maxNotifications)
      }
      return updated
    })

    return id
  }, [maxNotifications, recentMessages])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  useEffect(() => {
    const handleAddNotification = (event) => {
      addNotification(event.detail)
    }

    window.addEventListener('showCustomNotification', handleAddNotification)
    return () => {
      window.removeEventListener('showCustomNotification', handleAddNotification)
    }
  }, [addNotification])

  useEffect(() => {
    window.CustomNotifications = {
      add: addNotification,
      remove: removeNotification,
      clear: clearAll
    }

    return () => {
      delete window.CustomNotifications
    }
  }, [addNotification, removeNotification, clearAll])

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <CustomNotification
          key={notification.id}
          id={notification.id}
          senderName={notification.senderName}
          messageText={notification.messageText}
          senderInfo={notification.senderInfo}
          onClose={removeNotification}
          onClick={notification.onClick}
          autoCloseDelay={notification.autoCloseDelay || 10000}
        />
      ))}
      
      {notifications.length > 2 && (
        <div className="notifications-actions">
          <button 
            className="notifications-clear-all"
            onClick={clearAll}
            title="Закрыть все уведомления"
          >
            Закрыть все ({notifications.length})
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationContainer
