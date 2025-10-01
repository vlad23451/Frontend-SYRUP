/**
 * @fileoverview Сервис для работы с закрепленными сообщениями
 * 
 * Этот модуль содержит функции для взаимодействия с API закрепленных сообщений.
 * Предоставляет методы для закрепления, открепления и получения закрепленных сообщений.
 * 
 * Функциональность:
 * - Закрепление сообщений в чате
 * - Открепление сообщений
 * - Получение списка закрепленных сообщений
 * - Интеграция с apiRequest для обработки HTTP запросов
 * 
 * API endpoints:
 * - POST /pinned-messages/pin - закрепление сообщения
 * - DELETE /pinned-messages/unpin - открепление сообщения
 * - GET /pinned-messages/chat/{chatId} - получение закрепленных сообщений чата
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { apiRequest } from '../utils/apiUtils'

export const pinMessage = async (chatId, messageId) => {
  try {
    return await apiRequest(`/pinned-messages/pin?chat_id=${chatId}`, {
      method: 'POST',
      body: JSON.stringify({
        message_id: messageId
      })
    })
  } catch (error) {
    console.error('Ошибка при закреплении сообщения:', error)
    throw error
  }
}

export const unpinMessage = async (chatId, messageId) => {
  try {
    return await apiRequest(`/pinned-messages/unpin?chat_id=${chatId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message_id: messageId
      })
    })
  } catch (error) {
    console.error('Ошибка при откреплении сообщения:', error)
    throw error
  }
}

export const getPinnedMessages = async (chatId, skip = 0, limit = 20) => {
  try {
    const params = new URLSearchParams({
      skip: String(skip),
      limit: String(limit)
    }).toString()
    
    return await apiRequest(`/pinned-messages/chat/${chatId}?${params}`)
  } catch (error) {
    console.error('Ошибка при получении закрепленных сообщений:', error)
    throw error
  }
}
