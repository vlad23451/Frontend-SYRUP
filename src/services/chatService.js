/**
 * @fileoverview Сервис для работы с чатами и сообщениями
 * 
 * Этот модуль содержит функции для взаимодействия с API чатов и сообщений.
 * Предоставляет методы для получения списка чатов и истории сообщений.
 * 
 * Функциональность:
 * - Получение списка всех чатов пользователя
 * - Получение истории сообщений конкретного чата
 * - Интеграция с apiRequest для обработки HTTP запросов
 * - Работа с сообщениями по companionLogin
 * 
 * API endpoints:
 * - GET /messages/chats - получение списка чатов
 * - GET /messages/chats/{companionLogin}/messages - получение сообщений чата
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { apiRequest } from '../utils/apiUtils'

export const getChats = async () => {
  return apiRequest('/messages/chats')
}

// История переписки по chat_id
export const getChatHistory = async (chatId, skip = 0, limit = 50) => {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) }).toString()
  return apiRequest(`/messages/history/chat/${chatId}?${params}`)
}

// Создание/получение chat_id для чата с пользователем
export const getChatId = async (companionId) => {
  return apiRequest('/ws/get_chat_id', {
    method: 'POST',
    body: JSON.stringify({
      companion_id: companionId
    })
  })
}
