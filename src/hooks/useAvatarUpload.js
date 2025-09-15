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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setError('')
    
    if (!file) {
      clearAvatar()
      return
    }

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


  const uploadAvatar = async () => {
    if (!avatarFile) {
      setError('Файл не выбран')
      return null
    }

    setUploading(true)
    setError('')

    try {
      const response = await uploadAvatarService(avatarFile)
      
      if (response.avatar_key && auth.user) {
        auth.setUser({
          ...auth.user,
          avatar_key: response.avatar_key
        })
      }

      
      clearAvatar()
      
      return response
    } catch (error) {
      setError(error.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  const removeAvatar = async () => {
    setUploading(true)
    setError('')

    try {
      await deleteAvatar()
      
      if (auth.user) {
        auth.setUser({
          ...auth.user,
          avatar_key: null
        })
      }

      clearAvatar()
      return true
    } catch (error) {
      setError(error.message)
      return false
    } finally {
      setUploading(false)
    }
  }

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
