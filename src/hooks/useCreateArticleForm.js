import { useState } from 'react'

const createArticleUrl = "http://localhost:8000/article"

export const useCreateArticleForm = (authorId, onSuccess, onClose) => {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  })
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
      const response = await fetch(createArticleUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          author_id: authorId
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Ошибка создания истории")
      }

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

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    handleClose
  }
} 
