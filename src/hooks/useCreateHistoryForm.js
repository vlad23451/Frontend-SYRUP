import { useState } from 'react'
import { createHistory } from '../services/historyService'
import { useMediaUpload } from './useMediaUpload'

/**
 * useCreateHistoryForm
 * - Инкапсулирует состояние формы создания истории и отправку на API
 * - Возвращает обработчики и статусы для UI
 * - Интегрирован с медиа загрузкой
 */
export const useCreateHistoryForm = (authorId, onSuccess, onClose) => {
  const [formData, setFormData] = useState({ title: "", description: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Интеграция с медиа загрузкой
  const {
    attachedFiles,
    mediaError,
    isAttachingFiles,
    hasFiles,
    handleFilesChange,
    attachFilesToHistory,
    clearFiles,
    setMediaError
  } = useMediaUpload()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMediaError('')

    try {
      // 1. Создаем историю
      const createdHistory = await createHistory({
        title: formData.title,
        description: formData.description,
        author_id: authorId   
      })
      
      // 2. Прикрепляем файлы к созданной истории (если есть)
      if (hasFiles) {
        const filesAttached = await attachFilesToHistory(createdHistory.id)
        if (!filesAttached) {
          // Если файлы не прикрепились, но история создана - сообщаем об этом
          setError("История создана, но не удалось прикрепить файлы. Попробуйте прикрепить их при редактировании.")
          setLoading(false)
          return
        }
      }
      
      // 3. Очищаем форму и закрываем
      setFormData({ title: "", description: "" })
      clearFiles()
      onSuccess()
      onClose()
    } catch (err) {
      setError("Ошибка при создании истории: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading && !isAttachingFiles) {
      setFormData({ title: "", description: "" })
      setError("")
      clearFiles()
      onClose()
    }
  }

  // Общий статус загрузки (создание истории + прикрепление файлов)
  const isLoading = loading || isAttachingFiles
  
  // Общая ошибка (форма или медиа)
  const formError = error || mediaError

  return { 
    formData, 
    loading: isLoading, 
    error: formError, 
    handleChange, 
    handleSubmit, 
    handleClose,
    // Медиа функциональность
    attachedFiles,
    handleFilesChange,
    setMediaError: setError
  }
} 
