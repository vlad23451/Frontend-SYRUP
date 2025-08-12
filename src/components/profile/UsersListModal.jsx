import React, { useEffect, useRef } from 'react'
import ModalHeader from '../ui/ModalHeader'
import { useDraggableModal } from '../../hooks/ui/useDraggableModal'

const UsersListModal = ({ open, title, users, loading, error, onClose, onUserClick, onActionRender }) => {
  const containerRef = useRef(null)
  const handleRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onEsc = (e) => { if (e.key === 'Escape') onClose && onClose() }
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onEsc)
    }
  }, [open, onClose])

  useDraggableModal(open, containerRef, handleRef)

  if (!open) return null

  return (
    <div className="custom-modal-backdrop" onClick={(e) => { if (e.target.classList.contains('custom-modal-backdrop')) onClose && onClose() }}>
      <div className="custom-modal" ref={containerRef} style={{ maxWidth: 520 }}>
        <ModalHeader title={title} onClose={onClose} hideClose={true} />
        <div ref={handleRef} className="modal-drag-handle" aria-hidden />
        <div className="modal-drag-visible" aria-hidden />
        <div className="custom-modal-body">
          {loading && <div className="modal-loading">Загрузка...</div>}
          {error && <div className="modal-error">Ошибка: {error}</div>}
          {!loading && !error && (
            <div className="people-list" style={{ maxHeight: 420, overflow: 'auto' }}>
              {(users || []).length === 0 ? (
                <div style={{ padding: 16, textAlign: 'center', opacity: 0.8 }}>Список пуст</div>
              ) : (
                users.map(user => (
                  <div key={user.id} className="people-list-item" style={{ cursor: 'pointer' }} onClick={() => onUserClick && onUserClick(user)}>
                    <img
                      className="people-list-avatar"
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.login)}&background=random`}
                      alt={user.login}
                    />
                    <div className="people-list-info">
                      <span className="people-list-login">{user.login}</span>
                      {user.name && <span className="people-list-name">{user.name}</span>}
                    </div>
                    {onActionRender && (
                      <div onClick={(e) => e.stopPropagation()}>
                        {onActionRender(user)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersListModal


