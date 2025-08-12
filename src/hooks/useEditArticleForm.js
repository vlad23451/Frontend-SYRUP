import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

const editArticleUrl = "http://localhost:5000/article/"

export const useEditArticleForm = (onSave) => {
  const { id: articleId } = useParams()
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(editArticleUrl + articleId)
      .then(response => {
        if (!response.ok) throw new Error("Ошибка загрузки URL!")
        return response.json()
      })
      .then(data => {
        setFormData({
          title: data.title,
          description: data.description || ""
        })
        setLoading(false)
      })
      .catch(() => {
        setError("Ошибка загрузки статьи!")
        setLoading(false)
      })
  }, [articleId])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch(editArticleUrl + articleId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) throw new Error("Ошибка сохранения")
        if (onSave) onSave()
      })
      .catch(() => {
        setError("Ошибка сохранения новости")
      })
  }

  return { formData, loading, error, handleChange, handleSubmit }
} 
