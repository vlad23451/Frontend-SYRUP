/**
 * @fileoverview Утилиты для работы с чатами
 * 
 * Этот модуль содержит вспомогательные функции для работы с чатами.
 * Предоставляет утилиты для обработки выбора чатов и управления состоянием.
 * 
 * Функциональность:
 * - Обработка выбора чата по companion_login
 * - Поиск чата в списке по логину собеседника
 * - Обновление состояния выбранного чата
 * 
 * @param {string} companion_login - логин собеседника для поиска
 * @param {Array} chats - массив всех чатов пользователя
 * @param {Function} setSelectedChat - функция для установки выбранного чата
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */
export const handleChatSelect = (companion_login, chats, setSelectedChat) => {
  const chat = chats.find((c) => c.companion_login === companion_login)
  setSelectedChat(chat)
}

/**
 * Находит сообщение по времени в DOM
 * @param {string} messageTime - время сообщения в ISO формате
 * @returns {HTMLElement|null} - найденный элемент сообщения или null
 */
export const findMessageByTime = (messageTime) => {
  return document.querySelector(`[data-time="${messageTime}"]`)
}

/**
 * Находит сообщение по ID
 * @param {string|number} messageId - ID сообщения
 * @returns {HTMLElement|null} - найденный элемент сообщения или null
 */
export const findMessageById = (messageId) => {
  return document.getElementById(`message-${messageId}`)
}

/**
 * Прокручивает к сообщению по времени
 * @param {string} messageTime - время сообщения в ISO формате
 * @param {string} behavior - поведение прокрутки ('smooth' | 'auto')
 */
export const scrollToMessageByTime = (messageTime, behavior = 'smooth') => {
  const messageElement = findMessageByTime(messageTime)
  if (messageElement) {
    messageElement.scrollIntoView({ behavior })
  }
}

/**
 * Прокручивает к сообщению по ID
 * @param {string|number} messageId - ID сообщения
 * @param {string} behavior - поведение прокрутки ('smooth' | 'auto')
 */
export const scrollToMessageById = (messageId, behavior = 'smooth') => {
  const messageElement = findMessageById(messageId)
  if (messageElement) {
    messageElement.scrollIntoView({ behavior })
  }
}

/**
 * Получает время сообщения из data-time атрибута DOM элемента
 * @param {string|number} messageId - ID сообщения
 * @returns {string|null} - время сообщения или null если не найдено
 */
export const getMessageTimeFromDOM = (messageId) => {
  const messageElement = findMessageById(messageId)
  return messageElement?.getAttribute('data-time') || null
}

/**
 * Получает время последнего непрочитанного сообщения из DOM
 * @returns {string|null} - время последнего непрочитанного сообщения или null
 */
export const getLastUnreadMessageTimeFromDOM = () => {
  // Находим все сообщения с data-time атрибутом
  const messageElements = document.querySelectorAll('[data-time]')
  
  // Ищем последнее непрочитанное сообщение (не от нас)
  for (let i = messageElements.length - 1; i >= 0; i--) {
    const element = messageElements[i]
    // Проверяем, что это не наше сообщение (нет класса 'own')
    if (!element.classList.contains('own')) {
      return element.getAttribute('data-time')
    }
  }
  
  return null
}
