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
