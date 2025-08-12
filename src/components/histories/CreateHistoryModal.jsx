import React, { useEffect, useRef } from 'react'
import { useDraggableModal } from '../../hooks/ui/useDraggableModal'
import { useCreateHistoryForm } from '../../hooks/histories/useCreateHistoryForm'
import ModalHeader from '../ui/ModalHeader'
import ModalFooter from '../ui/ModalFooter'
import CreateHistoryForm from './CreateHistoryForm'

const CreateHistoryModal = ({ isOpen, onClose, onSuccess, authorId }) => {
  const { formData, loading, error, handleChange, handleSubmit, handleClose } = useCreateHistoryForm(authorId, onSuccess, onClose)

  // hooks must be declared unconditionally
  const containerRef = useRef(null)
  const handleRef = useRef(null)

  // drag via bottom grabбер like other modals
  useDraggableModal(isOpen, containerRef, handleRef)

  // close on ESC
  useEffect(() => {
    if (!isOpen) return
    const onEsc = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const handleBackdrop = (e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) handleClose()
  }

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdrop}>
      <div className="custom-modal-wrapper" ref={containerRef}>
        <div className="custom-modal">
        <ModalHeader 
          title="Создать новую историю"
          onClose={handleClose}
          disabled={loading}
          hideClose
        />
        
        <div className="custom-modal-content">
          {error && (
            <div className="modal-error">
              <strong>Ошибка:</strong> {error}
            </div>
          )}

          <CreateHistoryForm 
            formData={formData}
            loading={loading}
            error={error}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
        
        <ModalFooter 
          onSubmit={handleSubmit}
          loading={loading}
          hideCancel
          center
          noDivider
        />
        </div>
        <div className="modal-drag-handle bottom external" ref={handleRef} title="Переместить" />
        <div className="modal-drag-visible bottom external" />
      </div>
    </div>
  )
}

export default CreateHistoryModal 
