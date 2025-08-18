/**
 * @fileoverview Хук для работы с URL аватаров
 * 
 * Этот хук управляет загрузкой и кешированием URL аватаров.
 * Автоматически определяет тип аватара (свой/чужой) и загружает актуальную ссылку.
 * 
 * @param {string} avatarKey - ключ аватара в S3
 * @param {string|number} userId - ID пользователя (для чужих аватаров)
 * @param {boolean} isMyAvatar - флаг, является ли это моим аватаром
 * @returns {string|null} URL для отображения аватара
 */

import { useState, useEffect } from 'react'
import { getMyAvatarUrl, getUserAvatarUrl } from '../services/fileService'

export const useAvatarUrl = (avatarKey, userId = null, isMyAvatar = false) => {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadAvatarUrl = async () => {
      // Если нет ключа аватара, сбрасываем URL
      if (!avatarKey) {
        setAvatarUrl(null)
        return
      }

      // Если avatarKey уже является полной ссылкой, используем её
      if (avatarKey.startsWith('http')) {
        setAvatarUrl(avatarKey)
        return
      }

      // Иначе загружаем актуальную ссылку с сервера
      setLoading(true)
      try {
        let url = null
        if (isMyAvatar) {
          url = await getMyAvatarUrl()
        } else if (userId) {
          url = await getUserAvatarUrl(userId)
        }
        setAvatarUrl(url)
      } catch (error) {
        console.warn('Failed to load avatar URL:', error)
        setAvatarUrl(null)
      } finally {
        setLoading(false)
      }
    }

    loadAvatarUrl()
  }, [avatarKey, userId, isMyAvatar])

  return { avatarUrl, loading }
}

/**
 * Хук для получения URL своего аватара
 * @param {string} avatarKey - ключ аватара в S3
 * @returns {object} { avatarUrl, loading }
 */
export const useMyAvatarUrl = (avatarKey) => {
  return useAvatarUrl(avatarKey, null, true)
}

/**
 * Хук для получения URL аватара другого пользователя
 * @param {string} avatarKey - ключ аватара в S3
 * @param {string|number} userId - ID пользователя
 * @returns {object} { avatarUrl, loading }
 */
export const useUserAvatarUrl = (avatarKey, userId) => {
  return useAvatarUrl(avatarKey, userId, false)
}
