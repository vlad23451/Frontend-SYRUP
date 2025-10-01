/**
 * @fileoverview Модальное окно для блокировки пользователя
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useUserBlocks } from '../../hooks/useUserBlocks'
import ModalHeader from '../ui/ModalHeader'

const BlockUserModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onBlockSuccess 
}) => {
  const containerRef = useRef(null)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { blockUserAction } = useUserBlocks()

  const handleBackdropClick = useCallback((e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) {
      onClose && onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const onEsc = (e) => { if (e.key === 'Escape') onClose && onClose() }
    window.addEventListener('keydown', onEsc)
    // lock scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user?.user_info?.id) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const result = await blockUserAction(user.user_info.id, reason)
      
      if (result.success) {
        onBlockSuccess?.(user)
        onClose()
        setReason('')
      }
    } catch (error) {
      console.error('Ошибка при блокировке пользователя:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setReason('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdropClick}>
      <div className="custom-modal block-user-modal" ref={containerRef}>
        <ModalHeader title="Заблокировать пользователя" onClose={handleClose} />
        
        <div className="block-user-modal-body">
          <p className="block-user-confirmation">
            Вы уверены, что хотите заблокировать пользователя{' '}
            <strong>{user?.user_info?.username || 'Неизвестный пользователь'}</strong>?
          </p>
          
          <form onSubmit={handleSubmit} className="block-user-form">
            <div className="form-group">
              <label htmlFor="block-reason" className="form-label">
                Причина блокировки (необязательно):
              </label>
              <textarea
                id="block-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Укажите причину блокировки..."
                rows="3"
                disabled={isSubmitting}
                className="form-textarea"
              />
            </div>
            
            <div className="custom-modal-actions">
              <button
                type="button"
                className="custom-modal-btn"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="custom-modal-btn danger"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Блокирую...' : 'Заблокировать'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BlockUserModal
