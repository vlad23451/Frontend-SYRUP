import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getHistoryById, updateHistory } from "../services/historyService"

/**
 * useEditHistoryForm
 * - Загружает историю по id из URL и управляет состоянием формы редактирования
 * - Сохраняет изменения через historyService.updateHistory
 */
export const useEditHistoryForm = (onSave) => {
  const { id: historyId } = useParams()
  const [formData, setFormData] = useState({ title: "", description: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistoryById(historyId)
        setFormData({
          title: data.title,
          description: data.description || ""
        })
      } catch (err) {
        setError("Ошибка загрузки истории!")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [historyId])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await updateHistory(historyId, formData)
      if (onSave) onSave()
    } catch (err) {
      setError("Ошибка сохранения истории")
    }
  }

  return { formData, loading, error, handleChange, handleSubmit }
} 
