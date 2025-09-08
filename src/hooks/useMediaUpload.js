/**
 * @fileoverview Хук для управления медиа файлами в формах историй
 * 
 * Функциональность:
 * - Управление состоянием прикрепленных файлов
 * - Прикрепление файлов к истории после её создания
 * - Обработка ошибок загрузки
 * - Очистка состояния при закрытии формы
 */

import { useState } from 'react'
import { attachFileToHistory } from '../services/mediaService'

export const useMediaUpload = () => {
  const [attachedFiles, setAttachedFiles] = useState([])
  const [mediaError, setMediaError] = useState('')
  const [isAttachingFiles, setIsAttachingFiles] = useState(false)

  // Добавление/обновление файлов
  const handleFilesChange = (newFiles) => {
    setAttachedFiles(newFiles)
    if (mediaError) setMediaError('') // Очистка ошибки при изменении файлов
  }

  // Прикрепление всех загруженных файлов к истории
  const attachFilesToHistory = async (historyId) => {
    if (!attachedFiles.length) return true

    setIsAttachingFiles(true)
    setMediaError('')

    try {
      // Прикрепляем файлы параллельно
      const attachPromises = attachedFiles.map(file => 
        attachFileToHistory(file.id, historyId)
      )
      
      await Promise.all(attachPromises)
      return true
    } catch (error) {
      setMediaError(`Ошибка прикрепления файлов: ${error.message}`)
      return false
    } finally {
      setIsAttachingFiles(false)
    }
  }

  // Очистка состояния
  const clearFiles = () => {
    setAttachedFiles([])
    setMediaError('')
    setIsAttachingFiles(false)
  }

  // Проверка наличия файлов
  const hasFiles = attachedFiles.length > 0

  return {
    attachedFiles,
    mediaError,
    isAttachingFiles,
    hasFiles,
    handleFilesChange,
    attachFilesToHistory,
    clearFiles,
    setMediaError
  }
}
