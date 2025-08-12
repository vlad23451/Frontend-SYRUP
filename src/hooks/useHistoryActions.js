import { useState } from 'react'
import { useStore } from '../stores/StoreContext'
import { deleteHistory } from '../services/historyService'

/**
 * useHistoryActions
 * - Возвращает обработчики редактирования и удаления истории с подтверждением
 * - Удаление вызывает API и делегирует удаление из списка через onDelete(id)
 */
export const useHistoryActions = (history, onDelete) => {
  const { auth } = useStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleEdit = () => {
    // Логика редактирования - можно передать в родительский компонент
    console.log('Edit history:', history.id)
  }

  const handleDelete = async () => {
    if (!auth?.user) return
    
    setIsDeleting(true)
    try {
      await deleteHistory(history.id)
      if (onDelete) {
        onDelete(history.id)
      }
    } catch (err) {
      console.error('Ошибка удаления истории:', err)
    } finally {
      setIsDeleting(false)
      setShowConfirmModal(false)
    }
  }

  const handleDeleteClick = () => {
    setShowConfirmModal(true)
  }

  const handleCancelDelete = () => {
    setShowConfirmModal(false)
    setIsDeleting(false)
  }

  return {
    isDeleting,
    showConfirmModal,
    handleEdit,
    handleDelete: handleDeleteClick,
    handleConfirmDelete: handleDelete,
    handleCancelDelete
  }
} 
