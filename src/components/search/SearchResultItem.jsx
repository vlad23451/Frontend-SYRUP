import React from 'react'
import { formatMessageDateParts } from '../../utils/dateUtils'

const SearchResultItem = ({ result, onChatClick, onMessageClick }) => {
  const { message, chat_title, companion_login, companion_avatar_url } = result
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const handleChatClick = () => {
    if (onChatClick) {
      onChatClick(message.chat_id)
    }
  }

  const handleMessageClick = () => {
    if (onMessageClick) {
      onMessageClick(message.chat_id, message.id)
    }
  }

  return (
    <div className="search-result-item" onClick={handleMessageClick}>
      <div className="search-result-header">
        <div className="search-result-chat-info">
          <div className="search-result-avatar">
            {companion_avatar_url ? (
              <img 
                src={companion_avatar_url} 
                alt={companion_login}
                className="search-result-avatar-img"
              />
            ) : (
              <div className="search-result-avatar-placeholder">
                {companion_login?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="search-result-chat-details">
            <h4 className="search-result-chat-title" onClick={handleChatClick}>
              {chat_title}
            </h4>
            <p className="search-result-companion">
              {companion_login}
            </p>
          </div>
        </div>
        <div className="search-result-time">
          {formatMessageDateParts(message.timestamp, userTimezone).time}
        </div>
      </div>

      <div className="search-result-content">
        <div className="search-result-message">
          <div className="search-result-message-text">
            {message.text}
          </div>
          {message.is_pinned && (
            <span className="search-result-pinned">📌</span>
          )}
        </div>
      </div>

      <div className="search-result-footer">
        {message.edited_at && (
          <span className="search-result-edited">(ред.)</span>
        )}
        {message.is_deleted && (
          <span className="search-result-deleted">(удалено)</span>
        )}
      </div>
    </div>
  )
}

export default SearchResultItem
