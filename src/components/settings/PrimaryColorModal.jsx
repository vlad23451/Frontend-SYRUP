import React, { useEffect, useRef, useState } from 'react'
import ModalHeader from '../ui/ModalHeader'
import { useDraggableModal } from '../../hooks/useDraggableModal'

const PrimaryColorModal = ({ open, onClose, value, onChange }) => {
  const containerRef = useRef(null)
  const grabRef = useRef(null)
  const [local, setLocal] = useState(value || '#3b82f6')

  useEffect(() => setLocal(value || '#3b82f6'), [value])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  useDraggableModal(open, containerRef, grabRef)

  if (!open) return null

  const handleBackdrop = (e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) onClose()
  }

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdrop}>
      <div className="custom-modal-wrapper" ref={containerRef}>
        <div className="custom-modal" style={{ maxWidth: 420, width: '90vw' }}>
          <ModalHeader title="Основной цвет" onClose={onClose} />
          <div className="custom-modal-content" style={{ display: 'grid', gap: 10 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Выберите цвет</span>
              <input type="color" value={local} onChange={(e) => setLocal(e.target.value)} />
            </label>
          </div>
          <div className="custom-modal-actions" style={{ justifyContent: 'flex-end' }}>
            <button className="custom-modal-btn cancel" onClick={onClose}>Отмена</button>
            <button className="custom-modal-btn confirm" onClick={() => { onChange?.(local); onClose() }}>Применить</button>
          </div>
        </div>
        <div className="modal-drag-handle bottom external" ref={grabRef} title="Переместить" style={{ touchAction: 'none' }} />
        <div className="modal-drag-visible bottom external" />
      </div>
    </div>
  )
}

export default PrimaryColorModal


