import React, { useState, useEffect } from 'react'
import Avatar from './Avatar'

const CustomNotification = ({ 
  id,
  senderName, 
  messageText, 
  senderInfo = {},
  onClose,
  onClick,
  autoCloseDelay = 10000 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const showTimeout = setTimeout(() => setIsVisible(true), 50)

    const autoCloseTimeout = setTimeout(() => {
      handleClose()
    }, autoCloseDelay)

    return () => {
      clearTimeout(showTimeout)
      clearTimeout(autoCloseTimeout)
    }
  }, [autoCloseDelay])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose?.(id)
    }, 300)
  }

  const handleClick = () => {
    onClick?.()
    handleClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <div 
      className={`custom-notification ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Уведомление от ${senderName}: ${messageText}`}
    >
      <div className="notification-content">
        <div className="notification-avatar">
          <Avatar
            avatarUrl={senderInfo.avatar_url}
            size={40}
            alt={senderName}
          />
        </div>

        <div className="notification-body">
          <div className="notification-sender">{senderName}</div>
          <div className="notification-message">
            {messageText}
          </div>
        </div>

        <button 
          className="notification-close"
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
          aria-label="Закрыть уведомление"
        >
          ×
        </button>
      </div>

      <div className="notification-progress">
        <div 
          className="notification-progress-bar"
          style={{ animationDuration: `${autoCloseDelay}ms` }}
        />
      </div>
    </div>
  )
}

export default CustomNotification
