/**
 * @fileoverview Сервис для работы с файлами и загрузкой
 * 
 * Этот модуль содержит функции для взаимодействия с API файлов.
 * Предоставляет методы для загрузки аватарок и других файлов.
 * 
 * Функциональность:
 * - Загрузка аватарок пользователей
 * - Получение ссылок на аватары (свои и других пользователей)
 * - Валидация файлов перед загрузкой
 * - Обработка multipart/form-data запросов
 * 
 * API endpoints:
 * - POST /user/me/avatar - загрузка своего аватара
 * - GET /user/me/avatar - получение ссылки на свой аватар
 * - GET /user/profile/{user_id}/avatar - получение ссылки на аватар другого пользователя
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { apiRequest } from '../utils/apiUtils'

export const uploadTempAvatar = async (file) => {
  if (!file) {
    throw new Error('Файл не выбран')
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Неподдерживаемый тип файла. Используйте JPEG, PNG, GIF или WebP')
  }

  const maxSize = 5 * 1024 * 1024 // 5MB в байтах
  if (file.size > maxSize) {
    throw new Error('Файл слишком большой. Максимальный размер: 5MB')
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await apiRequest('/files/upload-temp-avatar', {
      method: 'POST',
      body: formData,
      headers: {}
    })

    return response
  } catch (error) {
    throw error
  }
}

export const uploadAvatar = async (file) => {
  if (!file) {
    throw new Error('Файл не выбран')
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Неподдерживаемый тип файла. Используйте JPEG, PNG, GIF или WebP')
  }

  const maxSize = 5 * 1024 * 1024 // 5MB в байтах
  if (file.size > maxSize) {
    throw new Error('Файл слишком большой. Максимальный размер: 5MB')
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await apiRequest('/user/me/avatar', {
      method: 'POST',
      body: formData,
      headers: {}
    })

    return response
  } catch (error) {
    throw error
  }
}

/**
 * Получение ссылки на свой аватар
 * @returns {Promise<string>} временная ссылка на аватар
 */
export const getMyAvatarUrl = async () => {
  try {
    const response = await apiRequest('/user/me/avatar', {
      method: 'GET'
    })
    return response.url
  } catch (error) {
    return null // Возвращаем null если аватар не найден
  }
}

/**
 * Получение ссылки на аватар другого пользователя
 * @param {string|number} userId - ID пользователя
 * @returns {Promise<string>} временная ссылка на аватар
 */
export const getUserAvatarUrl = async (userId) => {
  if (!userId) return null
  
  try {
    const response = await apiRequest(`/user/profile/${userId}/avatar`, {
      method: 'GET'
    })
    return response.url
  } catch (error) {
    return null // Возвращаем null если аватар не найден
  }
}

/**
 * Универсальная асинхронная функция для получения URL аватара
 * Использует кеш avatar_key и подгружает актуальную ссылку при необходимости
 * @param {string} avatarKey - ключ аватара в S3 или прямая ссылка
 * @param {string|number} userId - ID пользователя (для чужих аватаров)
 * @param {boolean} isMyAvatar - флаг, является ли это моим аватаром
 * @returns {Promise<string|null>} URL для отображения аватара
 */
export const getAvatarUrlAsync = async (avatarKey, userId = null, isMyAvatar = false) => {
  // Если нет ключа аватара, возвращаем null
  if (!avatarKey) return null
  
  // Если avatarKey уже является полной ссылкой (содержит http), используем её
  if (avatarKey.startsWith('http')) {
    return avatarKey
  }
  
  // Иначе получаем актуальную ссылку с сервера
  try {
    if (isMyAvatar) {
      return await getMyAvatarUrl()
    } else if (userId) {
      return await getUserAvatarUrl(userId)
    }
    return null
  } catch (error) {
    console.warn('Failed to get avatar URL:', error)
    return null
  }
}

/**
 * Синхронная версия getAvatarUrl для обратной совместимости
 * Возвращает переданную ссылку как есть, если это полный URL
 * Иначе возвращает заглушку для последующей загрузки через хуки
 * @param {string} fileUrl - URL файла или avatar_key
 * @returns {string|null} URL файла или null
 */
export const getAvatarUrlSync = (fileUrl) => {
  if (!fileUrl) return null
  
  // Если это уже полная ссылка, возвращаем как есть
  if (fileUrl.startsWith('http')) {
    return fileUrl
  }
  
  // Иначе возвращаем null - компонент должен использовать хуки для загрузки
  return null
}

export const deleteAvatar = async () => {
  return apiRequest('/user/me/avatar', {
    method: 'DELETE'
  })
}

// Экспортируем синхронную версию под старым именем для обратной совместимости
// Это основная функция getAvatarUrl, используемая в старых компонентах
export const getAvatarUrl = getAvatarUrlSync
