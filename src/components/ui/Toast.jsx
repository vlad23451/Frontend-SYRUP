/**
 * @fileoverview Компонент для отображения уведомлений (Toast)
 * 
 * Красивый кастомный компонент для показа уведомлений вместо стандартных alert().
 * Поддерживает разные типы уведомлений и автоматическое скрытие.
 */

import React, { useState, useEffect } from 'react'
import './Toast.css'

const Toast = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  isVisible = true 
}) => {
  const [show, setShow] = useState(isVisible)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      if (onClose) onClose()
    }, 300) // Ждем завершения анимации
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        )
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        )
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        )
      case 'info':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        )
      default:
        return null
    }
  }

  if (!show) return null

  return (
    <div className={`toast toast-${type} ${show ? 'toast-show' : 'toast-hide'}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon()}
        </div>
        <div className="toast-message">
          {message}
        </div>
        <button 
          className="toast-close"
          onClick={handleClose}
          aria-label="Закрыть уведомление"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Toast
