/**
 * @fileoverview Сервис для поиска сообщений
 * 
 * Этот модуль содержит функции для поиска сообщений в чатах.
 * Предоставляет методы для глобального поиска и поиска в конкретном чате.
 * 
 * Функциональность:
 * - Поиск сообщений по всему приложению
 * - Поиск сообщений в конкретном чате
 * - Пагинация результатов поиска
 * - Интеграция с apiRequest для обработки HTTP запросов
 * 
 * API endpoints:
 * - POST /messages/search - поиск сообщений
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { apiRequest } from '../utils/apiUtils'

export const searchMessages = async (query, limit = 20, offset = 0) => {
  try {
    const response = await apiRequest('/messages/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        limit,
        offset
      })
    })
    return response
  } catch (error) {
    console.error('Ошибка при поиске сообщений:', error)
    throw error
  }
}

export const searchMessagesInChat = async (query, chatId, limit = 10, offset = 0) => {
  try {
    const response = await apiRequest('/messages/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        chat_id: chatId,
        limit,
        offset
      })
    })
    return response
  } catch (error) {
    console.error('Ошибка при поиске сообщений в чате:', error)
    throw error
  }
}
