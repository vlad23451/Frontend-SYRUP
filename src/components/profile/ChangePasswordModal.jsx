/**
 * @fileoverview Модальное окно для смены пароля
 * 
 * Этот компонент предоставляет интерфейс для изменения пароля пользователя.
 * Использует PATCH /me/password API endpoint для обновления пароля.
 * 
 * Функциональность:
 * - Ввод старого пароля для подтверждения
 * - Ввод нового пароля с подтверждением
 * - Валидация паролей
 * - Проверка совпадения паролей
 * - Сохранение изменений через API
 * - Обработка состояний загрузки и ошибок
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React, { useState, useCallback, useEffect } from 'react'
import { changePassword } from '../../services/userService'
import ModalHeader from '../ui/ModalHeader'

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  })

  // Сброс формы при открытии/закрытии модального окна
  useEffect(() => {
    if (isOpen) {
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setError('')
      setShowPasswords({
        old: false,
        new: false,
        confirm: false
      })
    }
  }, [isOpen])

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Очищаем ошибку при изменении полей
    if (error) {
      setError('')
    }
  }, [error])

  const togglePasswordVisibility = useCallback((field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }, [])

  const validateForm = useCallback(() => {
    const { oldPassword, newPassword, confirmPassword } = formData

    if (!oldPassword.trim()) {
      setError('Введите текущий пароль')
      return false
    }

    if (!newPassword.trim()) {
      setError('Введите новый пароль')
      return false
    }

    if (newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов')
      return false
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают')
      return false
    }

    if (oldPassword === newPassword) {
      setError('Новый пароль должен отличаться от текущего')
      return false
    }

    return true
  }, [formData])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    if (loading) return

    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      await changePassword(formData.oldPassword, formData.newPassword)
      onClose()
    } catch (err) {
      setError(err.message || 'Ошибка при смене пароля')
    } finally {
      setLoading(false)
    }
  }, [formData, loading, validateForm, onClose])

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose()
    }
  }, [loading, onClose])

  if (!isOpen) return null

  return (
    <div className="custom-modal-backdrop" onClick={handleClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        <ModalHeader title="Сменить пароль" onClose={handleClose} />
        
        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="form-group">
            <label htmlFor="oldPassword" className="form-label">
              Текущий пароль
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.old ? 'text' : 'password'}
                id="oldPassword"
                value={formData.oldPassword}
                onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                className="form-input"
                placeholder="Введите текущий пароль"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('old')}
                disabled={loading}
              >
                {showPasswords.old ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              Новый пароль
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="form-input"
                placeholder="Введите новый пароль"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('new')}
                disabled={loading}
              >
                {showPasswords.new ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Подтвердите новый пароль
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="form-input"
                placeholder="Подтвердите новый пароль"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
                disabled={loading}
              >
                {showPasswords.confirm ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
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
              disabled={loading}
            >
              {loading ? 'Смена пароля...' : 'Сменить пароль'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
