/**
 * @fileoverview Хук для управления загрузкой аватарки
 * 
 * Этот хук предоставляет логику для загрузки и обновления аватарки пользователя.
 * Управляет состоянием загрузки, предварительным просмотром и обработкой ошибок.
 * 
 * Функциональность:
 * - Предварительный просмотр выбранного файла
 * - Валидация файла перед загрузкой
 * - Загрузка аватарки на сервер
 * - Обновление данных пользователя
 * - Обработка ошибок загрузки
 * 
 * Состояния:
 * - avatarFile: выбранный файл аватарки
 * - avatarPreview: URL для предварительного просмотра
 * - uploading: состояние загрузки
 * - error: ошибка загрузки
 * 
 * Возвращаемые значения:
 * - avatarFile, avatarPreview: файл и превью аватарки
 * - uploading, error: состояние загрузки и ошибки
 * - handleFileChange: функция обработки выбора файла
 * - uploadAvatar: функция загрузки аватарки
 * - clearAvatar: функция очистки выбранной аватарки
 * 
 * @returns {Object} объект с состоянием и функциями управления загрузкой аватарки
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { useState } from 'react'
import { uploadAvatar as uploadAvatarService, deleteAvatar } from '../services/fileService'
import { useStore } from '../stores/StoreContext'

export const useAvatarUpload = () => {
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const { auth } = useStore()

  /**
   * Обрабатывает выбор файла аватарки
   * @param {Event} e - событие выбора файла
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setError('')
    
    if (!file) {
      clearAvatar()
      return
    }

    // Создаем предварительный просмотр
    const reader = new FileReader()
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result)
    }
    reader.onerror = () => {
      setError('Ошибка чтения файла')
    }
    reader.readAsDataURL(file)
    setAvatarFile(file)
  }

  /**
   * Загружает аватарку на сервер
   * @returns {Promise<Object|null>} результат загрузки или null при ошибке
   */
  const uploadAvatar = async () => {
    if (!avatarFile) {
      setError('Файл не выбран')
      return null
    }

    setUploading(true)
    setError('')

    try {
      const response = await uploadAvatarService(avatarFile)
      
      // Обновляем данные пользователя в сторе
      if (response.avatar_key && auth.user) {
        auth.setUser({
          ...auth.user,
          avatar_key: response.avatar_key
        })
      }

      // Очищаем выбранный файл после успешной загрузки
      clearAvatar()
      
      return response
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  /**
   * Удаляет текущую аватарку пользователя
   * @returns {Promise<boolean>} успешность удаления
   */
  const removeAvatar = async () => {
    setUploading(true)
    setError('')

    try {
      await deleteAvatar()
      
      // Обновляем данные пользователя в сторе
      if (auth.user) {
        auth.setUser({
          ...auth.user,
          avatar_key: null
        })
      }

      clearAvatar()
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setUploading(false)
    }
  }

  /**
   * Очищает выбранную аватарку и превью
   */
  const clearAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    setError('')
  }

  return {
    avatarFile,
    avatarPreview,
    uploading,
    error,
    handleFileChange,
    uploadAvatar,
    removeAvatar,
    clearAvatar
  }
}
