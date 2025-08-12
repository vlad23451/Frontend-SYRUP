/**
 * @fileoverview Модалка редактирования истории
 * 
 * Локально хранит форму, отправляет `updateHistory`, и по `onSuccess`
 * возвращает обновлённый объект истории родителю без перезагрузки страницы.
 * Поддерживает перетаскивание через `useDraggableModal` и закрытие по ESC/бекдропу.
 */
import React, { useEffect, useRef, useState } from 'react'
import { useDraggableModal } from '../../hooks/ui/useDraggableModal'
import ModalHeader from '../ui/ModalHeader'
import ModalFooter from '../ui/ModalFooter'
import EditHistoryForm from './EditHistoryForm'
import { updateHistory } from '../../services/historyService'

const EditHistoryModal = ({ isOpen, onClose, history, onSuccess }) => {
  const [formData, setFormData] = useState({ title: history?.title || '', description: history?.description || '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const containerRef = useRef(null)
  const handleRef = useRef(null)
  useDraggableModal(isOpen, containerRef, handleRef)

  useEffect(() => {
    if (!isOpen) return
    setFormData({ title: history?.title || '', description: history?.description || '' })
  }, [isOpen, history])

  useEffect(() => {
    if (!isOpen) return
    const onEsc = (e) => { if (e.key === 'Escape') onClose && onClose() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdrop = (e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) onClose && onClose()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!history?.id) return
    setLoading(true)
    setError('')
    try {
      const updated = await updateHistory(history.id, formData)
      const updatedHistory = (updated && updated.id) ? updated : { ...history, ...formData }
      onSuccess && onSuccess(updatedHistory)
      onClose && onClose()
    } catch (e) {
      setError(e.message || 'Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdrop}>
      <div className="custom-modal-wrapper" ref={containerRef}>
        <div className="custom-modal">
          <ModalHeader title="Редактировать историю" onClose={onClose} disabled={loading} hideClose />
          <div className="custom-modal-content">
            {error && <div className="modal-error">{error}</div>}
            <EditHistoryForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
        <div className="modal-drag-handle bottom external" ref={handleRef} title="Переместить" />
        <div className="modal-drag-visible bottom external" />
      </div>
    </div>
  )
}

export default EditHistoryModal


