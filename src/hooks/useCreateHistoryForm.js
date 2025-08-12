import { useState } from 'react'
import { createHistory } from '../services/historyService'

/**
 * useCreateHistoryForm
 * - Инкапсулирует состояние формы создания истории и отправку на API
 * - Возвращает обработчики и статусы для UI
 */
export const useCreateHistoryForm = (authorId, onSuccess, onClose) => {
  const [formData, setFormData] = useState({ title: "", description: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

    try {
      await createHistory({
        title: formData.title,
        description: formData.description,
        author_id: authorId   
      })
      
      setFormData({ title: "", description: "" })
      onSuccess()
      onClose()
    } catch (err) {
      setError("Ошибка при создании истории: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({ title: "", description: "" })
      setError("")
      onClose()
    }
  }

  return { formData, loading, error, handleChange, handleSubmit, handleClose }
} 
