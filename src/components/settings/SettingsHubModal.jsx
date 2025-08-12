import React, { useEffect, useRef } from 'react'
import ModalHeader from '../ui/ModalHeader'
import { useSettings } from '../../contexts/SettingsContext'
import { useDraggableModal } from '../../hooks/ui/useDraggableModal'

const SettingsHubModal = ({ open, onClose }) => {
  const containerRef = useRef(null)
  const grabRef = useRef(null)
  const { openSection } = useSettings()

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

  const tabs = [
    { key: 'appearance', label: 'Внешний вид' },
    { key: 'dock', label: 'Док' },
    { key: 'chat', label: 'Чат' },
    { key: 'notifications', label: 'Уведомления' },
    { key: 'security', label: 'Безопасность' },
    { key: 'account', label: 'Аккаунт' },
  ]

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdrop}>
      <div className="custom-modal-wrapper" ref={containerRef}>
        <div className="custom-modal settings-modal" style={{ maxWidth: 340, width: '95vw', maxHeight: '70vh' }}>
          <ModalHeader title="Настройки" onClose={onClose} hideClose />
          <div className="custom-modal-content" style={{ display: 'grid', gap: 10, maxHeight: 'calc(70vh - 96px)', overflowY: 'auto', paddingTop: 6, paddingBottom: 6 }}>
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className="custom-modal-btn"
                onClick={() => openSection(key)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', fontSize: 14 }}
              >
                <span>{label}</span>
                <span style={{ opacity: 0.6 }}>›</span>
              </button>
            ))}
          </div>
        </div>
        <div className="modal-drag-handle bottom external" ref={grabRef} title="Переместить" style={{ touchAction: 'none' }} />
        <div className="modal-drag-visible bottom external" />
      </div>
    </div>
  )
}

export default SettingsHubModal


