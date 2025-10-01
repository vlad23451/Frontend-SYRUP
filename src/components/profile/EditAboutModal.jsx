/**
 * @fileoverview Модальное окно для редактирования описания профиля
 * 
 * Этот компонент предоставляет интерфейс для изменения описания профиля пользователя.
 * Использует PATCH /me API endpoint для обновления информации.
 * 
 * Функциональность:
 * - Отображение текущего описания профиля
 * - Редактирование описания в текстовом поле
 * - Валидация введенных данных
 * - Сохранение изменений через API
 * - Обработка состояний загрузки и ошибок
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React, { useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../stores/StoreContext'
import { updateProfileAbout } from '../../services/userService'
import ModalHeader from '../ui/ModalHeader'

const EditAboutModal = observer(({ isOpen, onClose }) => {
  const { profile } = useStore()
  const [about, setAbout] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Инициализация текущего описания при открытии модального окна
  useEffect(() => {
    if (isOpen && profile.user) {
      setAbout(profile.user.user_info?.about || '')
      setError('')
    }
  }, [isOpen, profile.user])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    if (loading) return

    setLoading(true)
    setError('')

    try {
      await updateProfileAbout(about)
      
      // Обновляем локальное состояние профиля через store
      profile.updateProfileAbout(about)
      
      onClose()
    } catch (err) {
      setError(err.message || 'Ошибка при обновлении описания')
    } finally {
      setLoading(false)
    }
  }, [about, loading, profile, onClose])

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose()
    }
  }, [loading, onClose])

  if (!isOpen) return null

  return (
    <div className="custom-modal-backdrop" onClick={handleClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        <ModalHeader title="Редактировать описание" onClose={handleClose} />
        
        <form onSubmit={handleSubmit} className="edit-about-form">
          <div className="form-group">
            <label htmlFor="about" className="form-label">
              Описание профиля
            </label>
            <textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Расскажите о себе..."
              className="form-textarea"
              rows={4}
              maxLength={500}
              disabled={loading}
            />
            <div className="character-count">
              {about.length}/500 символов
            </div>
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="custom-modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="custom-modal-btn"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="custom-modal-btn confirm"
              disabled={loading || about === (profile.user?.user_info?.about || '')}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

export default EditAboutModal
