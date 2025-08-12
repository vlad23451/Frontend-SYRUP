import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const useArticleActions = (article, onDelete) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`/edit-article/${article.id}`)
  }

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      setIsDeleting(true)
      try {
        const response = await fetch(`http://localhost:8000/article/${article.id}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (response.ok) {
          onDelete(article.id)
        } else {
          throw new Error('Ошибка удаления статьи')
        }
      } catch (error) {
        console.error('Error deleting article:', error)
        alert('Ошибка при удалении статьи')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return {
    isDeleting,
    handleEdit,
    handleDelete
  }
}
