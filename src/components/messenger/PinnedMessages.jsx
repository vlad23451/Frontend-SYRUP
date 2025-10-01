import React, { useState, useEffect } from 'react'
import { formatMessageDateParts } from '../../utils/dateUtils'

const PinnedMessages = ({ pinnedMessages, onUnpin, onMessageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Сбрасываем индекс при изменении списка закрепленных сообщений
  useEffect(() => {
    setCurrentIndex(0)
  }, [pinnedMessages])
  
  if (!pinnedMessages || pinnedMessages.length === 0) {
    return null
  }

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const currentPinned = pinnedMessages[currentIndex]
  const message = currentPinned?.message

  if (!message) return null

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % pinnedMessages.length
    setCurrentIndex(nextIndex)
  }

  const handleClick = () => {
    onMessageClick?.(message)
    handleNext()
  }

  return (
    <div className="pinned-messages">
      <div className="pinned-messages-list">
        <div 
          className="pinned-message-item"
          onClick={handleClick}
        >
          <div className="pinned-message-pin-icon">
            <svg width="16" height="16" viewBox="0 0 337.162 337.162" fill="currentColor">
              <path d="M331.314,105.653L231.612,5.951c-3.766-3.766-8.789-5.84-14.143-5.84c-5.354,0-10.376,2.074-14.142,5.84l-20.506,20.506 c-7.798,7.798-7.797,20.486,0,28.284l1.817,1.817l-73.825,63.353l-7.2-7.2c-3.911-3.911-9.453-6.154-15.205-6.154 c-5.064,0-9.917,1.718-13.664,4.838L43.009,137.82c-4.16,3.463-6.582,8.261-6.821,13.509c-0.239,5.248,1.737,10.246,5.564,14.073 l52.547,52.547c-18.038,18.14-43.306,43.606-46.531,47.132c-4.848,5.288-9.471,10.641-13.844,15.921 c-8.744,10.564-16.398,20.93-22.571,30.202c-3.09,4.634-5.814,8.988-8.149,12.928c-7.116,12.45-1.695,16.457,9.576,9.576 c3.94-2.335,8.294-5.06,12.928-8.149c9.272-6.173,19.638-13.828,30.202-22.572c5.28-4.373,10.633-8.996,15.921-13.844 c3.526-3.225,28.992-28.493,47.132-46.531l52.901,52.901c3.6,3.6,8.303,5.583,13.243,5.583c5.494,0,10.72-2.493,14.339-6.84 l26.423-31.736c6.903-8.29,6.313-21.24-1.315-28.869l-7.2-7.2l63.353-73.825l1.817,1.817c3.766,3.766,8.788,5.839,14.143,5.839 c5.354,0,10.376-2.074,14.142-5.839l20.506-20.506C339.112,126.139,339.112,113.451,331.314,105.653z"/>
            </svg>
          </div>
          <div className="pinned-message-content">
            <div className="pinned-message-text">
              {message.text || 'Сообщение с файлом'}
            </div>
            {pinnedMessages.length > 1 && (
              <div className="pinned-message-counter">
                {currentIndex + 1} из {pinnedMessages.length}
              </div>
            )}
          </div>
          
          <div 
            className="pinned-message-unpin-btn"
            onClick={(e) => {
              e.stopPropagation()
              onUnpin?.(currentPinned.messageId || currentPinned.id)
            }}
            title="Открепить сообщение"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinnedMessages
