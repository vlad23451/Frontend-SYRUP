import React, { useEffect, useRef } from 'react'
import ModalHeader from '../ui/ModalHeader'

const CustomThemeModal = ({ open, onClose, customTheme, setCustomTheme }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])


  if (!open) return null

  const handleBackdrop = (e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) onClose()
  }

  const update = (key) => (e) => setCustomTheme({ ...customTheme, [key]: e.target.value })

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdrop}>
      <div className="custom-modal-wrapper" ref={containerRef}>
        <div className="custom-modal" style={{ maxWidth: 520, width: '92vw' }}>
          <ModalHeader title="Кастомная тема" onClose={onClose} />
          <div className="custom-modal-content" style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <label style={{ display:'grid', gap:4 }}>
                <span>Фон</span>
                <input type="color" value={customTheme.bg || '#ffffff'} onChange={update('bg')} />
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Текст</span>
                <input type="color" value={customTheme.text || '#0f172a'} onChange={update('text')} />
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Основной цвет</span>
                <input type="color" value={customTheme.primary || '#3b82f6'} onChange={update('primary')} />
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Кнопки</span>
                <input type="color" value={customTheme.button || '#3b82f6'} onChange={update('button')} />
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Панели/карточки</span>
                <input type="color" value={customTheme.panel || '#ffffff'} onChange={update('panel')} />
              </label>
              <label style={{ display:'grid', gap:4 }}>
                <span>Границы</span>
                <input type="color" value={customTheme.border || '#e5e7eb'} onChange={update('border')} />
              </label>
            </div>
          </div>
          <div className="custom-modal-actions" style={{ justifyContent: 'flex-end' }}>
            <button className="custom-modal-btn confirm" onClick={onClose}>Готово</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomThemeModal


